const aj = require("../utils/arcjet");

let isSpoofedBotFn;

async function getIsSpoofedBot() {
  if (!isSpoofedBotFn) {
    const mod = await import("@arcjet/inspect");
    isSpoofedBotFn = mod.isSpoofedBot;
  }
  return isSpoofedBotFn;
}

const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Too many requests. Please try again later" });
      }

      if (decision.reason.isBot()) {
        return res
          .status(403)
          .json({ message: "Bot access denied" });
      }

      return res
        .status(403)
        .json({ message: "Access denied by security policy" });
    }

    const isSpoofedBot = await getIsSpoofedBot();

    if (isSpoofedBot(req.headers)) {
      return res
        .status(403)
        .json({ message: "Spoofed bot blocked" });
    }

    next();
  } catch (error) {
    console.error("Arcjet protection error:", error);
    next();
  }
};

module.exports = arcjetProtection;
