const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const pugRoutes = require("./routes/pugRoutes.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.js");

dotenv.config();

app.set("view engine", "pug");

app.locals.siteTitle = "Bulletin App";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.static("public"));

app.use(cookieParser());

app.use(express.json());

const PORT = process.env.PORT;

connectDB();

app.use(express.urlencoded({ extended: true }));

app.use("/api/posts", postRoutes);
app.use("/api", authRoutes);
app.use("/", pugRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
