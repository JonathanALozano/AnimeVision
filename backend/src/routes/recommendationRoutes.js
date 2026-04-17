import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import Analysis from "../models/Analysis.js";
import { protect } from "../middleware/authMiddleware.js";
import { mapLabelsToFilters } from "../utils/mapLabels.js";
import { fetchAniListRecommendations } from "../services/anilistService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se envió imagen" });
    }

    const form = new FormData();
    form.append("file", req.file.buffer, req.file.originalname);

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/analyze`,
      form,
      { headers: form.getHeaders() }
    );

    const detectedLabels = aiResponse.data.labels || [];
    const visualStyle = aiResponse.data.visualStyle || "neutral";

    let strongLabels = detectedLabels.filter((item) => item.score >= 0.12);
    if (strongLabels.length === 0) {
      strongLabels = detectedLabels.slice(0, 3);
    }

    const filters = mapLabelsToFilters(strongLabels);
    const bestLabel = strongLabels[0]?.label || "";

    const recommendations = await fetchAniListRecommendations({
      genres: filters.genres,
      tags: filters.tags,
      bestLabel,
      visualStyle,
    });

    const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

const currentUserId =
  req.user?.id ||
  req.user?.userId ||
  req.user?._id ||
  null;

try {
  if (currentUserId) {
    await Analysis.create({
      user: currentUserId,
      imageUrl,
      detectedLabels: strongLabels,
      filtersUsed: {
        genres: filters.genres,
        tags: filters.tags,
      },
      recommendations: recommendations.map((anime) => ({
        anilistId: anime.id,
        title:
          anime.displayTitle ||
          anime.title?.english ||
          anime.title?.romaji ||
          anime.title?.native ||
          "Sin título",
        coverImage: anime.coverImage?.extraLarge || anime.coverImage?.large || "",
        genres: anime.genres || [],
        averageScore: anime.averageScore || null,
        popularity: anime.popularity || null,
      })),
    });
  } else {
    console.warn("No se guardó historial: no se pudo identificar el usuario autenticado.");
  }
} catch (saveError) {
  console.error("No se pudo guardar el análisis en historial:", saveError.message);
}
 
    return res.json({
      detectedLabels: strongLabels,
      filters,
      visualStyle,
      recommendations,
    });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    return res.status(500).json({
      error: "Error al generar recomendaciones",
    });
  }
});

export default router;