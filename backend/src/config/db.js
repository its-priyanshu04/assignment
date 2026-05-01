const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in environment variables.");
  }

  const sanitizedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");
  console.log("[DB] Connecting to MongoDB:", sanitizedUri);

  await mongoose.connect(mongoUri);
  console.log("[DB] MongoDB connection established.");
};

module.exports = connectDb;
