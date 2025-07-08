import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [32, "Category name must not exceed 32 characters"],
      unique: true,
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt and updatedAt
  }
);

export default mongoose.model("Category", categorySchema);
