import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import EditPost from "./components/EditPost";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PostDetail from "./pages/PostDetail";


function Home() {
    const [posts, setPosts] = useState([]);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");  // ← token check

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/posts");
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
            await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }  // ← token bheja
            });
            setPosts((prev) => prev.filter((post) => post._id !== id));
        } catch (error) {
            alert("Pehle login karo!");
            navigate("/login");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/login");
    };

    const recentPosts = posts.slice(0, 3);

    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>My Blog</h1>
                {token ? (
                    <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>Logout</button>
                ) : (
                    <button onClick={() => navigate("/login")} style={{ padding: "0.5rem 1rem" }}>Admin Login</button>
                )}
            </div>

            {/* CreatePost sirf admin ko dikhega */}
            {token && <CreatePost onPostCreated={handlePostCreated} />}

            <div className="recent-header">
                <h2 className="recent-title">Recent Posts</h2>
                <Link to="/posts" className="see-all-btn">See All Posts →</Link>
            </div>

            <div className="posts">
                {recentPosts.map((post) => (
                    //<div className="post" key={post._id}>
                    <div className="post" key={post._id} onClick={() => navigate(`/post/${post._id}`)} style={{ cursor: "pointer" }}>
                        {post.image && <img src={post.image} alt="post" />}
                        <div className="post-content">
                            <div className="post-date">
                                {new Date(post.createdAt).toDateString()}
                            </div>
                            <div className="post-username">Created by {post.username || "Anonymous"}</div>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            {/* Delete/Edit sirf admin ko dikhega */}
                            {token && (
                                <div className="post-actions">
                                    <button className="delete-btn" onClick={() => handleDelete(post._id)}>Delete</button>
                                    <button className="edit-btn" onClick={() => navigate(`/edit/${post._id}`)}>Edit</button>
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