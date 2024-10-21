const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');  // For generating random token
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    petName: { type: String, required: true },
    petAge: { type: Number, required: true },
    mobileNumber: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /\+\d{1,3}\d{10}/.test(v),
            message: "Mobile number is not valid"
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => validator.isEmail(v),
            message: "Invalid email format"
        }
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },  // Store verification token
    emailVerificationTokenExpires: { type: Date } // Token expiration time
});

// Password hashing before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate email verification token
UserSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.emailVerificationToken = token;
    this.emailVerificationTokenExpires = Date.now() + 3600000; // 1 hour expiration
    return token;
};

module.exports = mongoose.model('User', UserSchema);
