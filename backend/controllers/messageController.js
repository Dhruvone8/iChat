const Message = require("../models/messageModel")
const User = require("../models/userModel")
const cloudinary = require("../config/cloudinary");
const { getReceiverSocketId } = require("../utils/socket");

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

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: id },
                { senderId: id, receiverId: myId }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Chat fetched successfully",
            messages
        })

    } catch (error) {
        console.error("Error in handleGetChatById:", error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Send Message
const handleSendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id } = req.params;
        const senderId = req.user._id;

        // Message Input Validation
        if (!text && !image) {
            return res.status(400).json({
                success: false,
                message: "Text or Image is required"
            })
        }

        // Can't Send Message to Yourself
        if (senderId.equals(id)) {
            return res.status(400).json({
                success: false,
                message: "Can't send message to yourself"
            })
        }

        // Check if receiver exists
        const receiverId = await User.exists({ _id: id });

        if (!receiverId) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found"
            })
        }

        let imageUrl;

        // If user wants to send an image
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId: id,
            text,
            image: imageUrl
        })

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        console.error("Error in handleSendMessage:", error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const handleGetAllChats = async (req, res) => {
    try {
        const loggedInUserId = req.user._id.toString();

        // Find all the messages, where the loggedIn user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        const chatUserIds = [...new Set(messages.map(msg =>
            msg.senderId.toString() === loggedInUserId ? msg.receiverId.toString() : msg.senderId.toString()
        ))];

        const chatUsers = await User.find({ _id: { $in: chatUserIds } }).select("-password");

        res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            chatUsers
        })
    } catch (error) {
        console.error("Error in handleGetAllChats:", error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    handleGetAllContacts,
    handleGetChatById,
    handleSendMessage,
    handleGetAllChats
}