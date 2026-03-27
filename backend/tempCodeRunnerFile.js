const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/posts", require("./routes/postRoutes"));

app.get("/", (req, res) => {
    res.send("API is running...");
});

// Server start
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





    // const express = require("express");
    // const mongoose = require("mongoose");
    // const cors = require("cors");

    // const postRoutes = require("./routes/postRoutes"); 

    // const app = express();

    // app.use(cors());
    // app.use(express.json());

    // app.use("/api", postRoutes); 

    // app.listen(5000, () => {
    // console.log("Server running on port 5000");
    // });