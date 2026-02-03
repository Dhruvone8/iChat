const dotenv = require("dotenv");
dotenv.config();

const arcjetModule = require("@arcjet/node");

const arcjet = arcjetModule.default;
const { shield, detectBot, slidingWindow } = arcjetModule;

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    slidingWindow({
      mode: "LIVE",
      max: 50,
      interval: 60,
    }),
  ],
});

module.exports = aj;
