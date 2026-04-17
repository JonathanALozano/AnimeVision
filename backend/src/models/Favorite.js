import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    anilistId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    genres: {
      type: [String],
      default: [],
    },
    averageScore: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index({ user: 1, anilistId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
