const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDb = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("[BOOT] Starting backend server...");
    console.log("[BOOT] Env summary:", {
      port: PORT,
      hasMongoUri: Boolean(process.env.MONGODB_URI),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
    });

    await connectDb();
    app.listen(PORT, () => {
      console.log(`[BOOT] Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[BOOT] Failed to start server:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

startServer();
