const express = require('express');
const router = express.Router();
const path = require('path');
const User = require(path.resolve(__dirname, '../models/User'));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendVerificationEmail =  require(path.resolve(__dirname, '../config/emailVerification'));
const validator = require('validator');
require('dotenv').config();

// Register route
router.post('/register', async (req, res) => {
    const { petName, petAge, mobileNumber, email, username, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'Username already exists' });

        // Check if email is valid
        if (!validator.isEmail(email)) return res.status(400).json({ message: 'Invalid email format' });
        user = await User.findOne({email: email})
        if (user) return res.status(400).json({ message: 'Email already exists' });


        // Check mobile number format
        if (!/\+\d{1,3}\d{10}/.test(mobileNumber)) {
            return res.status(400).json({ message: 'Invalid mobile number format' });
        }

        // Create user
        user = new User({ petName, petAge, mobileNumber, email, username, password });

        // Generate email verification token
        const verificationToken = user.generateVerificationToken();

        await user.save();
        sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'User registered. Please verify your email' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Email Verification route
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            emailVerificationToken: req.params.token,
            emailVerificationTokenExpires: { $gt: Date.now() }  // Check if token is not expired
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.isVerified = true;
        user.emailVerificationToken = undefined;  // Remove token after verification
        user.emailVerificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login route

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Sending Invalid credentials in both cases in order to not give information for brut force hacking,
        // the user does not know if the username is incorrect of the password is incorrect

        // Ensure email is verified
        if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email' });

        // Generate JWT token for authentication after login
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            petDetails: {
                petName: user.petName,
                petAge: user.petAge,
                mobileNumber: user.mobileNumber
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

