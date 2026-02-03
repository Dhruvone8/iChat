const Message = require("../models/messageModel")
const User = require("../models/userModel")

// Get all Contacts
const handleGetAllContacts = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        // Get all users from the database except the LoggedIn User
        const contacts = await User.find({ _id: { $ne: loggedInUser } }).select("-password")

        res.status(200).json({
            success: true,
            message: "Contacts fetched successfully",
            contacts
        })
    } catch (error) {
        console.error("Error in handleGetAllContacts:", error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Get a chat with a user
const handleGetChatById = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id } = req.params;

        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: id },
                { senderId: id, receiverId: myId }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Chat fetched successfully",
            message
        })

    } catch (error) {
        console.error("Error in handleGetChatById:", error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    handleGetAllContacts,
    handleGetChatById
}