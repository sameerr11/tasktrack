const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let tasks = [];

router.get('/', auth, (req, res) => {
    res.json(tasks.filter(task => task.userId === req.user.id));
});

router.post('/', auth, (req, res) => {
    const { title, description } = req.body;
    const task = { id: tasks.length + 1, userId: req.user.id, title, description };
    tasks.push(task);
    res.status(201).json(task);
});

module.exports = router;
