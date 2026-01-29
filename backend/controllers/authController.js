const User = require("../models/userModel")
const bcrypt = require("bcrypt")

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

    } catch (error) {
        console.error("Error in handleRegistration:", error.message)
        res.status(500).json({ message: "Internal server error" })

    }
}