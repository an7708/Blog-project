import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/api/posts/${id}`)
            .then(res => { setPost(res.data); setLoading(false); })
            .catch(() => { setLoading(false); });
    }, [id]);

    if (loading) return <p className="loading">Loading...</p>;
    if (!post) return <p className="loading">Post not found.</p>;

    return (
        <div style={{ background: "#f5f5f0", minHeight: "100vh", fontFamily: "'Gill Sans', sans-serif" }}>
            <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 0" }}>
                <button onClick={() => navigate(-1)} style={{
                    background: "none", border: "1.5px solid #ddd", borderRadius: 8,
                    padding: "7px 16px", cursor: "pointer", fontSize: 13,
                    color: "#555", display: "flex", alignItems: "center", gap: 6
                }}>← Back</button>
            </div>
            {post.image && (
                <div style={{ maxWidth: 780, margin: "20px auto 0", padding: "0 20px" }}>
                    <img src={post.image} alt={post.title} style={{
                        width: "100%", height: 380, objectFit: "cover",
                        borderRadius: 16, display: "block"
                    }} />
                </div>
            )}
            <div style={{ maxWidth: 780, margin: "28px auto 60px", padding: "0 20px" }}>
                <div style={{
                    background: "#fff", borderRadius: 16, padding: "36px 40px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.07)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: "50%",
                            background: "#2264cd", color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: "bold", fontSize: 15, flexShrink: 0
                        }}>
                            {(post.username || "A")[0].toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#2264cd" }}>
                                {post.username || "Anonymous"}
                            </div>
                            <div style={{ fontSize: 12, color: "#999" }}>
                                {new Date(post.createdAt).toLocaleDateString("en-IN", {
                                    year: "numeric", month: "long", day: "numeric"
                                })}
                            </div>
                        </div>
                    </div>
                    <h1 style={{
                        fontSize: "2rem", fontWeight: "bold", color: "#1a1a1a",
                        marginBottom: 20, lineHeight: 1.3, fontStyle: "italic"
                    }}>{post.title}</h1>
                    <div style={{ height: 2, background: "#f0f0f0", borderRadius: 2, marginBottom: 24 }} />
                    <p style={{ fontSize: 16, color: "#444", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
                        {post.content}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;