import { useState } from "react";
import axios from "axios";

function CreatePost({ onPostCreated }) {
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [errors, setErrors] = useState({});

    const showToast = (msg, type = "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const validate = () => {
        const e = {};
        if (!username.trim()) e.username = "Name is required";
        if (!title.trim()) e.title = "Title is required";
        if (!content.trim()) e.content = "Post content is required";
        if (image) {
            const allowed = ["image/jpeg", "image/png", "image/webp"];
            if (!allowed.includes(image.type)) e.image = "Only JPEG, PNG or WebP allowed";
            else if (image.size > 5 * 1024 * 1024) e.image = "Image must be under 5MB";
        }
        return e;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
        const token = localStorage.getItem("adminToken");

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, formData, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        onPostCreated(res.data);
        setUsername(""); setTitle(""); setContent(""); setImage(null);
        showToast("Post published successfully!", "success");
    } catch (err) {
        const status = err.response?.status;
        const messages = {
            401: "Session expired — please log in again",
            413: "Image file is too large for the server",
            500: "Server error — please try again",
        };
        showToast(messages[status] ?? "Upload failed — check your connection");
    } finally {
        setLoading(false);
    }
};

    return (
        <>
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
                    <span style={{ fontSize: 16 }}>{toast.type === "success" ? "✓" : "✕"}</span>
                    {toast.msg}
                </div>
            )}

            <div className="create-card" style={{ maxWidth: 480, margin: "0 auto 50px" }}>
                <h2 className="create-title" style={{ fontSize: "1.1rem", marginBottom: 16 }}>
                    Create Post
                </h2>

                <form onSubmit={handleSubmit} noValidate>
                    <Field error={errors.username}>
                        <input
                            type="text" placeholder="Your name" value={username}
                            onChange={(e) => { setUsername(e.target.value); setErrors(p => ({...p, username: ""})); }}
                            className="create-input"
                            style={errors.username ? { borderColor: "#e74c3c", marginBottom: 4 } : {}}
                        />
                    </Field>

                    <Field error={errors.title}>
                        <input
                            type="text" placeholder="Title" value={title}
                            onChange={(e) => { setTitle(e.target.value); setErrors(p => ({...p, title: ""})); }}
                            className="create-input"
                            style={errors.title ? { borderColor: "#e74c3c", marginBottom: 4 } : {}}
                        />
                    </Field>

                    <Field error={errors.content}>
                        <textarea
                            placeholder="Write your post..." value={content}
                            onChange={(e) => { setContent(e.target.value); setErrors(p => ({...p, content: ""})); }}
                            className="create-textarea"
                            style={{ minHeight: 80, ...(errors.content ? { borderColor: "#e74c3c", marginBottom: 4 } : {}) }}
                        />
                    </Field>

                    <Field error={errors.image}>
                        <label style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "9px 12px", border: "1.5px dashed #ddd",
                            borderRadius: 8, cursor: "pointer", marginBottom: errors.image ? 4 : 14,
                            fontSize: 13, color: "#666", background: "#fafafa",
                            ...(errors.image ? { borderColor: "#e74c3c" } : {})
                        }}>
                            <span>📎</span>
                            <span>{image ? image.name : "Choose image (optional)"}</span>
                            <input
                                type="file" accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => { setImage(e.target.files[0]); setErrors(p => ({...p, image: ""})); }}
                                style={{ display: "none" }}
                            />
                        </label>
                    </Field>

                    <button
                        type="submit" className="create-btn"
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        {loading ? "Publishing..." : "Add Post"}
                    </button>
                </form>
            </div>
        </>
    );
}

function Field({ error, children }) {
    return (
        <div>
            {children}
            {error && (
                <p style={{ color: "#e74c3c", fontSize: 12, marginBottom: 10, marginTop: 2, paddingLeft: 2 }}>
                    {error}
                </p>
            )}
        </div>
    );
}

export default CreatePost;




















// import { useState } from "react";




// import axios from "axios";

// function CreatePost({ onPostCreated }) {
//     const [username, setUsername] = useState("");
//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");
//     const [image, setImage] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("username", username);
//         formData.append("title", title);
//         formData.append("content", content);
//         if (image) formData.append("image", image);

//         try {
//             const res = await axios.post("http://localhost:5000/api/posts", formData);
//             onPostCreated(res.data);
//             setUsername("");
//             setTitle("");
//             setContent("");
//             setImage(null);
//         } catch (error) {
//             alert("Upload failed");
//         }
//     };

//     return (
//         <div className="create-card">
//             <h2 className="create-title">Create Post</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     placeholder="Your name"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="create-input"
//                 />
//                 <input
//                     type="text"
//                     placeholder="Title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="create-input"
//                 />
//                 <textarea
//                     placeholder="Write your post..."
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     className="create-textarea"
//                 />
//                 <input
//                     type="file"
//                     onChange={(e) => setImage(e.target.files[0])}
//                     className="create-file"
//                 />
//                 <button type="submit" className="create-btn">Add Post</button>
//             </form>
//         </div>
//     );
// }

// export default CreatePost;