require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(`${process.env.MONGODB_URI}/iChat`)
  .then(() => console.log("MongoDB Connection Established!! ✅"))
  .catch((err) => console.error("MongoDB Error:", err));

module.exports = mongoose.connection;