const User = require('../models/User');
const OTP = require('../models/OTP');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/emailService');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, phone, email, password } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { phone }] });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists with this email or phone');
        }

        const user = await User.create({
            firstName,
            lastName,
            phone,
            email,
            password,
            status: 'VERIFIED' // Direct verification for now
        });

        if (user) {
            // OTP Logic Commented out for dev/demo
            /*
            // Generate OTP
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await bcrypt.hash(otpCode, 10);

            await OTP.create({
                email,
                otp: hashedOtp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            });

            // Send OTP Email
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'LawFirmConnect - Verify your email',
                    message: `Your verification code is: ${otpCode}. It expires in 10 minutes.`
                });
            } catch (emailError) {
                console.error("Email send failed", emailError);
            }
            */

            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                msg: 'User registered successfully.'
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Email with OTP
// @route   POST /auth/verify-email
// @access  Public
const verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.status === 'VERIFIED') {
            res.status(200).json({ msg: 'Email already verified. Please login.' });
            return;
        }

        // Find latest OTP for email
        const validOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!validOtp) {
            res.status(400);
            throw new Error('OTP not found or expired. Please request a new one.');
        }

        if (validOtp.expiresAt < Date.now()) {
            res.status(400);
            throw new Error('OTP expired.');
        }

        const isMatch = await bcrypt.compare(otp, validOtp.otp);

        if (!isMatch) {
            res.status(400);
            throw new Error('Invalid OTP');
        }

        user.status = 'VERIFIED';
        await user.save();

        // Optional: Delete used OTPs for this email to be clean
        await OTP.deleteMany({ email });

        res.status(200).json({ msg: 'Email verified successfully' });

    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (user.status !== 'VERIFIED') {
                res.status(401);
                throw new Error('Account not verified. Please verify your email.');
            }

            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        console.error("Login error", error);
        next(error);
    }
};

// @desc    Get current user info
// @route   GET /auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    getCurrentUser
};
