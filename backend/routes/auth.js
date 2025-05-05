const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = [];

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) return res.status(400).json({ message: 'User exists' });
    const user = { id: users.length + 1, name, email, password };
    users.push(user);
    res.status(201).json(user);
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ token });
});

module.exports = router;
