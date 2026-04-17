import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageName: {
      type: String,
      default: "imagen_subida",
    },
    detectedLabels: {
      type: [
        {
          label: String,
          score: Number,
        },
      ],
      default: [],
    },
    filters: {
      genres: {
        type: [String],
        default: [],
      },
      tags: {
        type: [String],
        default: [],
      },
    },
    resultsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const History = mongoose.model("History", historySchema);
