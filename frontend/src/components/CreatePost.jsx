    import { useState } from "react";
    import axios from "axios";

    function CreatePost({ onPostCreated }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        //formData.append("image", image);
        
        if (image) {
            formData.append("image", image);
        }

        try {
        const res = await axios.post(
            "http://localhost:5000/api/posts",
            formData
            // {
            // headers: {
            //     "Content-Type": "multipart/form-data",
            // },
            // }
        );

        onPostCreated(res.data);
        setTitle("");
        setContent("");
        setImage(null);
        } catch (error) {
        alert("Upload failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>Create Post</h2>

        <input
            className="posTitle"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />

        <br />

        <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className = "newPost"
        />

        <br />

        <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
        />

        <br />

        <button type="submit" className="file">Add Post</button>
        </form>
    );
    }

    export default CreatePost;