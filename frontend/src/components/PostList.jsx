import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/posts");
            setPosts(res.data);
            setError("");
        } catch (err) {
            setError("Backend is not running");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`);
            setPosts((prev) => prev.filter((post) => post._id !== id));
        } catch (error) {
            console.error("Delete failed", error);
            alert("Delete failed");
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <div className="all-posts-header">
                <h1>All Posts</h1>
                <Link to="/" className="see-all-btn">← Back to Home</Link>
            </div>

            <div className="posts">
                {posts.length === 0 ? (
                    <p>No posts available</p>
                ) : (
                    posts.map((post) => (
                        //<div className="post" key={post._id}>
                        <div className="post" key={post._id} onClick={() => navigate(`/post/${post._id}`)} style={{ cursor: "pointer" }}>
                            {post.image && <img src={post.image} alt="post" />}
                            <div className="post-content">
                                <div className="post-date">{new Date(post.createdAt).toDateString()}</div>
                                <div className="post-username">Created by {post.username || "Anonymous"}</div>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                <div className="post-actions">
                                    <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}>Delete</button>
                                    <button className="edit-btn" onClick={(e) => { e.stopPropagation(); navigate(`/edit/${post._id}`); }}>Edit</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PostList;