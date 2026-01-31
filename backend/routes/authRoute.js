const express = require("express");
const router = express.Router();
const { handleRegistration, handleLogin, handleLogout } = require("../controllers/authController");

router.post("/register", handleRegistration);

router.post("/login", handleLogin);

router.post("/logout", handleLogout);

module.exports = router;