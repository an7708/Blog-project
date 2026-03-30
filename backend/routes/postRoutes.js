const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const protect = require('../middleware/authMiddleware');
// GET all posts
router.get("/", async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
});


// routes/posts.js mein:
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


// CREATE post
router.post("/", protect, upload.single("image"), async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file) {
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "blog_posts" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
            const result = await streamUpload();
            imageUrl = result.secure_url;
        }

        const newPost = new Post({
            username: req.body.username || "Anonymous",
            title: req.body.title,
            content: req.body.content,
            image: imageUrl,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

// EDIT post
router.put("/:id", protect, upload.single("image"), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        let imageUrl = post.image;

        if (req.file) {
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "blog_posts" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
            const result = await streamUpload();
            imageUrl = result.secure_url;
        }

        post.username = req.body.username || post.username;
        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        post.image = imageUrl;

        const updatedPost = await post.save();
        res.json(updatedPost);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE post
router.delete("/:id", protect, async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Post not found" });
        res.json({ message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;