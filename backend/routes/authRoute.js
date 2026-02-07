const express = require("express");
const router = express.Router();
const { handleRegistration, handleLogin, handleLogout, handleUpdateProfile } = require("../controllers/authController");
const isLoggedIn = require("../middlewares/checkAuth");
const arcjetProtection = require("../middlewares/ratelimiter");

// Registration Route
router.post("/register", arcjetProtection, handleRegistration);

// Login Route
router.post("/login", arcjetProtection, handleLogin);

// Logout Route
router.post("/logout", arcjetProtection, handleLogout);

// Auth Check Route
router.get("/check", isLoggedIn, (req, res) => {
    res.status(200).json(req.user);
})

// Update Profile
router.put("/update-profile", arcjetProtection, isLoggedIn, handleUpdateProfile);

module.exports = router;