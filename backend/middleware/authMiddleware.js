    const jwt = require('jsonwebtoken');

    const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Login karo pehle!' });
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token invalid hai!' });
    }
    };

    module.exports = protect;