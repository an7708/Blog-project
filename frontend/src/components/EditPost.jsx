import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        axios.get(`http://localhost:5000/api/posts/${id}`)
            .then(res => {
                const post = res.data;
                setUsername(post.username || "");
                setTitle(post.title);
                setContent(post.content);
                setLoading(false);
            })
            .catch(err => {
                showToast("Failed to load post");
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            showToast("Title and content are required");
            return;
        }
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const formData = new FormData();
            formData.append("username", username);
            formData.append("title", title);
            formData.append("content", content);
            if (image) formData.append("image", image);

            await axios.put(`http://localhost:5000/api/posts/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showToast("Post updated successfully!", "success");
            setTimeout(() => navigate("/posts"), 1500);
        } catch (err) {
            const status = err.response?.status;
            const messages = {
                401: "Session expired — please log in again",
                403: "You are not authorized to edit this post",
                500: "Server error — please try again",
            };
            showToast(messages[status] ?? "Edit failed — check your connection");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="loading">Loading...</p>;

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

            <div className="edit-card">
                <h2>Edit Post</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="edit-input"
                    />
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="edit-input"
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="edit-textarea"
                    />
                    <label style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 12px", border: "1.5px dashed #ddd",
                        borderRadius: 8, cursor: "pointer", marginBottom: 20,
                        fontSize: 13, color: "#666", background: "#fafafa",
                    }}>
                        <span>📎</span>
                        <span>{image ? image.name : "Replace image (optional)"}</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => setImage(e.target.files[0])}
                            style={{ display: "none" }}
                        />
                    </label>
                    <div className="edit-actions">
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                            style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/posts")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPost;