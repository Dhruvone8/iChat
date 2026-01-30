const express = require("express");
const router = express.Router();
const { handleRegistration } = require("../controllers/authController");

router.post("/register", handleRegistration);

router.post("/login", (req, res) => {

})

router.get("/logout", (req, res) => {
    
})

module.exports = router;