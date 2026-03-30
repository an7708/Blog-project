import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        // Token nahi hai toh login pe bhejo
        if (!token) {
            navigate("/login");
            return;
        }
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/posts");
            setPosts(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts((prev) => prev.filter((post) => post._id !== id));
        } catch (error) {
            alert("Delete failed!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/login");
    };

    return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
            <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
                Logout
            </button>
        </div>

        <button
            onClick={() => navigate("/")}
            style={{ marginBottom: "2rem", padding: "0.6rem 1.2rem", cursor: "pointer" }}
        >
            + Naya Post Banao
        </button>

        <h2>Saari Posts</h2>
        {posts.length === 0 && <p>Koi post nahi hai abhi!</p>}

        {/* Instagram jaisa Grid */}
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
        }}>
            {posts.map((post) => (
                <div key={post._id} style={{
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                    aspectRatio: "1 / 1",
                    backgroundColor: "#eee",
                    cursor: "pointer",
                }}>
                    {/* Image ya placeholder */}
                    {post.image ? (
                        <img
                            src={post.image}
                            alt="post"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <div style={{
                            width: "100%", height: "100%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            backgroundColor: "#ddd", fontSize: "14px", color: "#666"
                        }}>
                            No Image
                        </div>
                    )}

                    <div style={{
                        position: "absolute", top: 0, left: 0,
                        width: "100%", height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        opacity: 0, transition: "opacity 0.3s",
                        padding: "1rem", boxSizing: "border-box"
                    }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                        <p style={{
                            color: "white", fontWeight: "bold",
                            textAlign: "center", marginBottom: "1rem",
                            fontSize: "14px"
                        }}>
                            {post.title}
                        </p>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                onClick={() => navigate(`/edit/${post._id}`)}
                                style={{
                                    padding: "0.4rem 1rem", cursor: "pointer",
                                    backgroundColor: "white", border: "none",
                                    borderRadius: "4px", fontWeight: "bold"
                                }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(post._id)}
                                style={{
                                    padding: "0.4rem 1rem", cursor: "pointer",
                                    backgroundColor: "#ff4444", color: "white",
                                    border: "none", borderRadius: "4px", fontWeight: "bold"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
}
export default AdminDashboard;