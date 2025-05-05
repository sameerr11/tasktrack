const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch {
        res.sendStatus(403);
    }
};
