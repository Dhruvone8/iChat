const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const user = await User.findById(decodedToken.id).select("-password")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Error in isLoggedIn:", error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = isLoggedIn