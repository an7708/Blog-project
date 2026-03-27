    const express = require("express");
    const router = express.Router();
    const Post = require("../models/Post");
    const upload = require("../middleware/upload"); // ✅ only one
    const cloudinary = require("../config/cloudinary");
    const streamifier = require("streamifier"); // ✅ added

    // GET posts
    router.get("/", async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
    });

    // CREATE post with image
    router.post("/", upload.single("image"), async (req, res) => {
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

    // DELETE
    router.delete("/:id", async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
    });

    module.exports = router;