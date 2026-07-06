const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected:", connectDB.connection.host);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
