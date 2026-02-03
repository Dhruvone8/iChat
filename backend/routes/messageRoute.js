const express = require("express")
const router = express.Router();
const { handleGetAllContacts, handleGetChatById, handleSendMessage, handleGetAllChats } = require("../controllers/messageController")
const isLoggedIn = require("../middlewares/checkAuth")
const arcjetProtection = require("../middlewares/ratelimiter")

// Get all Contacts
router.get("/contacts", arcjetProtection, isLoggedIn, handleGetAllContacts)

// Get all Chats
router.get("/chats", arcjetProtection, isLoggedIn, handleGetAllChats)

// Get a chat with a user
router.get("/:id", arcjetProtection, isLoggedIn, handleGetChatById)

// Send Message
router.post("/send/:id", arcjetProtection, isLoggedIn, handleSendMessage)

module.exports = router