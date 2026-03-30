import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import EditPost from "./components/EditPost";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PostDetail from "./pages/PostDetail";

const API = import.meta.env.VITE_API_URL;

function Home() {
    const [posts, setPosts] = useState([]);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    const showToast = (msg, type = "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${API}/api/posts`);
                setPosts(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchPosts();
    }, [refreshFlag]);

    const handlePostCreated = () => {
        setRefreshFlag(!refreshFlag);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts((prev) => prev.filter((post) => post._id !== id));
            showToast("Post deleted!", "success");
        } catch (error) {
            const status = error.response?.status;
            if (status === 401) {
                showToast("Session expired — please log in again");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                showToast("Delete failed — try again");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/login");
    };

    const recentPosts = posts.slice(0, 3);

    return (
        <div className="container">

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", top: 20, right: 20, zIndex: 999,
                    padding: "12px 18px", borderRadius: 10, fontSize: 14,
                    fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
                    background: toast.type === "success" ? "#e6f9f0" : "#fdecea",
                    color: toast.type === "success" ? "#0f6e3a" : "#b91c1c",
                    border: `1px solid ${toast.type === "success" ? "#86efb9" : "#fca5a5"}`,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                }}>
                    <span>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>My Blog</h1>
                {token ? (
                    <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>Logout</button>
                ) : (
                    <button onClick={() => navigate("/login")} style={{ padding: "0.5rem 1rem" }}>Admin Login</button>
                )}
            </div>

            {token && <CreatePost onPostCreated={handlePostCreated} />}

            <div className="recent-header">
                <h2 className="recent-title">Recent Posts</h2>
                <Link to="/posts" className="see-all-btn">See All Posts →</Link>
            </div>

            <div className="posts">
                {recentPosts.map((post) => (
                    <div className="post" key={post._id}
                        onClick={() => navigate(`/post/${post._id}`)}
                        style={{ cursor: "pointer" }}>
                        {post.image && <img src={post.image} alt="post" />}
                        <div className="post-content">
                            <div className="post-date">{new Date(post.createdAt).toDateString()}</div>
                            <div className="post-username">Created by {post.username || "Anonymous"}</div>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            {token && (
                                <div className="post-actions">
                                    <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}>Delete</button>
                                    <button className="edit-btn" onClick={(e) => { e.stopPropagation(); navigate(`/edit/${post._id}`); }}>Edit</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts" element={<PostList />} />
                <Route path="/edit/:id" element={<EditPost />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/post/:id" element={<PostDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;