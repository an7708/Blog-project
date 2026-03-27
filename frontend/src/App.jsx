import { useState, useEffect } from "react";
import axios from "axios";
import CreatePost from "./components/CreatePost";

function App() {
    const [posts, setPosts] = useState([]);
    const [refreshFlag, setRefreshFlag] = useState(false);

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
        console.log("handleDelete called, id =", id);
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`);
            setPosts((prev) => prev.filter((post) => post._id !== id));
        } catch (error) {
            console.error("Delete failed", error);
            alert("Delete failed");
        }
    };

    return (
        <div className="container">
            <h1>My Blog</h1>

            <CreatePost onPostCreated={handlePostCreated} />

            <div className="posts">
                {posts.map((post) => (
                    <div className="post" key={post._id}>

                        {post.image && <img src={post.image} alt="post" />}

                        <div className="post-content">
                            <div className="post-date">
                                {new Date(post.createdAt).toDateString()}
                            </div>

                            <h3>{post.title}</h3>
                            <p>{post.content}</p>

                            
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(post._id)}
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;