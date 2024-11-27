require("dotenv");
const mongoose = require("mongoose");
const connectMongoDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  console.log("Mongo URI:", mongoURI);

  if (!mongoURI) {
    console.log("MongoDB URI is missing in environment variables.");
    throw new Error("MongoDB URI is required.");
  }
  mongoose.set("strictQuery", false);

  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully to MongoDB.");
  } catch (error) {
    console.error("Error occurred during MongoDB connection:", error.message);
    console.error("Error details:", error);
    throw new Error("Could not connect to MongoDB.");
  }
};

module.exports = connectMongoDB;
