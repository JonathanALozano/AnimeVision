
import express from "express";
import Favorite from "../models/Favorite.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const currentUserId =
      req.user?.id ||
      req.user?.userId ||
      req.user?._id ||
      null;

    if (!currentUserId) {
      return res.status(401).json({ message: "Usuario no identificado" });
    }

    const favorites = await Favorite.find({ user: currentUserId }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error("Error obteniendo favoritos:", error.message);
    res.status(500).json({ message: "No se pudieron obtener favoritos" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const currentUserId =
      req.user?.id ||
      req.user?.userId ||
      req.user?._id ||
      null;

    if (!currentUserId) {
      return res.status(401).json({ message: "Usuario no identificado" });
    }

    const { anilistId, title, coverImage, genres, averageScore } = req.body;

    const exists = await Favorite.findOne({
      user: currentUserId,
      anilistId,
    });

    if (exists) {
      return res.status(400).json({ message: "Ese anime ya está en favoritos" });
    }

    const favorite = await Favorite.create({
      user: currentUserId,
      anilistId,
      title,
      coverImage,
      genres: genres || [],
      averageScore: averageScore || null,
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error("Error guardando favorito:", error.message);
    res.status(500).json({ message: "No se pudo guardar en favoritos" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const currentUserId =
      req.user?.id ||
      req.user?.userId ||
      req.user?._id ||
      null;

    if (!currentUserId) {
      return res.status(401).json({ message: "Usuario no identificado" });
    }

    const deletedFavorite = await Favorite.findOneAndDelete({
      _id: req.params.id,
      user: currentUserId,
    });

    if (!deletedFavorite) {
      return res.status(404).json({ message: "Favorito no encontrado o no pertenece al usuario" });
    }

    res.json({
      message: "Favorito eliminado",
      deletedId: deletedFavorite._id,
    });
  } catch (error) {
    console.error("Error eliminando favorito:", error.message);
    res.status(500).json({ message: "No se pudo eliminar de favoritos" });
  }
});

export default router;