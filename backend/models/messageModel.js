const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        trim: true,
        maxLength: 500
    },
    image: {
        type: String
    },
},
    { timestamps: true }
)

module.exports = mongoose.model("Message", messageSchema)