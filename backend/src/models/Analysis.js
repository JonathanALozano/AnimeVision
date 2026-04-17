import mongoose from "mongoose";

const detectedLabelSchema = new mongoose.Schema(
  {
    label: String,
    score: Number,
  },
  { _id: false }
);

const recommendationSchema = new mongoose.Schema(
  {
    anilistId: Number,
    title: String,
    coverImage: String,
    genres: [String],
    averageScore: Number,
    popularity: Number,
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    detectedLabels: {
      type: [detectedLabelSchema],
      default: [],
    },
    filtersUsed: {
      genres: {
        type: [String],
        default: [],
      },
      tags: {
        type: [String],
        default: [],
      },
    },
    recommendations: {
      type: [recommendationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Analysis", analysisSchema);