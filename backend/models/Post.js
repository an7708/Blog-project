const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    username: { type: String, default: "Anonymous" },
    title: String,
    content: String,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Post", postSchema);