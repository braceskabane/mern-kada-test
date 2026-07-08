const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [1000, "Content cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "General",
        "Web Dev",
        "AI/ML",
        "DevOps",
        "UI/UX",
        "Q&A",
        "Project",
      ],
      default: "General",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
