const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");  
const postRoutes = require("./routes/postRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/posts", require("./routes/postRoutes"));

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
