const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
const port = process.env.PORT || 3000
const authRoute = require("./routes/authRoute")
const messageRoute = require("./routes/messageRoute")

// Middlewares
app.use(express.json())

// Routes
app.use("/auth", authRoute)
app.use("/messages", messageRoute)

app.listen(port, () => console.log(`Server running on port ${port}`))