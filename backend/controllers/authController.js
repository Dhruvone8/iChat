const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const generateToken = require("../utils/generateToken")
const { sendWelcomeEmail } = require("../emails/emailHandlers")
const cloudinary = require("../config/cloudinary")
const dotenv = require("dotenv");
dotenv.config();

// Registration Controller
const handleRegistration = async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        // Check if all the fields are filled
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Check password length validation
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        // Check Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" })
        }

        // Check if the user already exists
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        // Hash the user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new User
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            // Generate token & cookie
            generateToken(newUser._id, res)

            res.status(201).json({
                success: true,
                message: "Registered successfully",
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
            });

            // Send Welcome Email
            try {
                await sendWelcomeEmail(newUser.email, newUser.fullName, process.env.CLIENT_URL)
            } catch (error) {
                console.error("Failed to send welcome email", error)
            }
        } else {
            res.status(400).json({
                success: false,
                message: "User registration failed"
            })
        }

    } catch (error) {
        console.error("Error in handleRegistration:", error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Login Controller
const handleLogin = async (req, res) => {

    const { email, password } = req.body;

    try {
        // Input Validation
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        // Generate token & cookie
        generateToken(user._id, res)

        res.status(200).json({
            success: true,
            message: "Logged In successfully",
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.error("Error in handleLogin:", error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Logout Controller
const handleLogout = async (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })

    res.status(201).json({
        success: true,
        message: "Logged Out successfully"
    })
}

// Update Profile Controller
const handleUpdateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" })
        }

        const userId = req.user._id;

        const result = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: result.secure_url }, { new: true })

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        })

    } catch (error) {
        console.error("Error in handleUpdateProfile:", error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    handleRegistration,
    handleLogin,
    handleLogout,
    handleUpdateProfile
}