const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const pugRoutes = require("./routes/pugRoutes.js");
const e = require("express");

dotenv.config();

app.set("view engine", "pug");

app.locals.siteTitle = "Bulletin App";

app.use(express.static("public"));

app.use(express.json());

const PORT = process.env.PORT;

connectDB();

app.use("/api/posts", postRoutes);
app.use("/", pugRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
