const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const e = require("express");

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT;

connectDB();

app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
