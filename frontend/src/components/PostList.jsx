import { useEffect, useState } from "react";
import axios from "axios";

function PostList({ refreshFlag }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
    }, [refreshFlag]);

    const handleDelete = async (id) => {
        console.log("handleDelete called, id =", id);
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`);
            setPosts((prev) => prev.filter((post) => post._id !== id));
        } catch (error) {
            console.error("Delete failed", error);
            alert("Delete failed");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Blog Posts</h2>

            {posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                posts.map((post) => {
                    return (
                        <div key={post._id}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>

                            {post.image && (
                                <img
                                    src={post.image}
                                    alt="post"
                                    width="200"
                                />
                            )}

                            <button onClick={() => handleDelete(post._id)}>
                                Delete
                            </button>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default PostList;