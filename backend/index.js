const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
