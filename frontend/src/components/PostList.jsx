import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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
                setLoading(true);
                const res = await axios.get(`${API}/api/posts`);
                setPosts(res.data);
                setError("");
            } catch (err) {
                setError("Could not load posts — check your connection");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts((prev) => prev.filter((post) => post._id !== id));
            showToast("Post deleted!", "success");
        } catch (err) {
            const status = err.response?.status;
            if (status === 401) {
                showToast("Session expired — please log in again");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                showToast("Delete failed — try again");
            }
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="loading">{error}</p>;

    return (
        <div className="container">
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
            <div className="all-posts-header">
                <h1>All Posts</h1>
                <Link to="/" className="see-all-btn">← Back to Home</Link>
            </div>
            <div className="posts">
                {posts.length === 0 ? (
                    <p>No posts available</p>
                ) : (
                    posts.map((post) => (
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
                    ))
                )}
            </div>
        </div>
    );
}

export default PostList;