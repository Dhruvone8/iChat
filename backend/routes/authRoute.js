const express = require("express");
const router = express.Router();
const { handleRegistration, handleLogin, handleLogout, handleUpdateProfile } = require("../controllers/authController");
const { isLoggedIn } = require("../middlewares/checkAuth");

// Registration Route
router.post("/register", handleRegistration);

// Login Route
router.post("/login", handleLogin);

// Logout Route
router.post("/logout", handleLogout);

// Update Profile
router.put("/update-profile", isLoggedIn, handleUpdateProfile);

module.exports = router;