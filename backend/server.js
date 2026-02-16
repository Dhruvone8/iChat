const express = require("express")
const dotenv = require("dotenv")
const { app, server } = require("./utils/socket")
dotenv.config()
const port = process.env.PORT || 3000
const authRoute = require("./routes/authRoute")
const messageRoute = require("./routes/messageRoute")
const db = require("./config/db");
const cookieParser = require("cookie-parser")
const cors = require("cors");

// Middlewares
app.use(express.json({ limit: "5mb" }))
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(cookieParser())

// Routes
app.use("/auth", authRoute)
app.use("/messages", messageRoute)

server.listen(port, () => console.log(`Server running on port ${port}`))