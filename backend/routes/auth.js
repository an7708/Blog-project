    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const Admin = require('../models/Admin');

    // Register (sirf ek baar chalana hai apna account banane ke liye)
    router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ username, password: hashedPassword });
        await admin.save();
        res.json({ message: 'Admin account ban gaya!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    });

    // Login
    router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ error: 'Admin nahi mila' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: 'Wrong password' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    });

    module.exports = router;