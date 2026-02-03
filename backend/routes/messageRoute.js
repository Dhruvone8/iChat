const express = require("express")
const router = express.Router();
const { handleGetAllContacts, handleGetChatById } = require("../controllers/messageController")
const isLoggedIn = require("../middlewares/checkAuth")

// Get all Contacts
router.get("/contacts", isLoggedIn, handleGetAllContacts)

// Get all Chats
// router.get("/chats", handleGetAllChats)

// Get a chat with a user
router.get("/:id", isLoggedIn, handleGetChatById)

// // Send Message
// router.post("/send/:id", handleSendMessage)

module.exports = router