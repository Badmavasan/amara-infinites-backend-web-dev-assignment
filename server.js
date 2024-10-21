const express = require('express');
const path = require('path');
const connectDB = require(path.resolve(__dirname, 'config/db'));
const authRoutes = require(path.resolve(__dirname, 'routes/auth'));
require('dotenv').config();

const app = express();
connectDB();

// Middleware
app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
