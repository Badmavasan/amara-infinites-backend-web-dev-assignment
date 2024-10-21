const express = require('express');
const fs = require('fs');
const path = require('path');

// Resolve the path to the 'models' directory
const modelsPath = path.resolve(__dirname, 'models');

// Check if 'models' path exists and is a directory
fs.stat(modelsPath, (err, stats) => {
    if (err) {
        console.error(`Error: The path ${modelsPath} does not exist or is inaccessible.`);
    } else if (stats.isDirectory()) {
        console.log(`The directory ${modelsPath} exists.`);
    } else {
        console.log(`${modelsPath} exists but is not a directory.`);
    }
});

const connectDB = require(path.resolve(__dirname, 'config/db'));
const authRoutes = require(path.resolve(__dirname, 'routes/auth'));
require('dotenv').config();
require('module-alias/register');

const app = express();
connectDB();

// Middleware
app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
