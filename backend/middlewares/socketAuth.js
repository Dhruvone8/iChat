const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const socketAuth = async (socket, next) => {
    try {
        // Extract token from http-only cookie
        const token = socket.handshake.headers.cookie?.split("; ").find((row) => row.startsWith("jwt="))?.split("=")[1];

        if (!token) {
            console.log("Socket Connection Rejected: No Token Provided");
            return next(new Error("Unauthorised - No Token Provided"))
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            console.log("Socket Connection Rejected: Invalid Token");
            return next(new Error("Unauthorised - Invalid Token"))
        }

        // Find authenticated user
        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            console.log("Socket Connection Rejected: User Not Found");
            return next(new Error("Unauthorised - User Not Found"))
        }

        // Attach user to socket
        socket.user = user
        socket.userId = user._id.toString()
        next()

    } catch (error) {
        console.log("Error in Socket Authentication: ", error.message);
        return next(new Error("Internal Server Error"))
    }
}

module.exports = socketAuth