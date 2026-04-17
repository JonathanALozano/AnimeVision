import express from "express";
import Analysis from "../models/Analysis.js";
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
      return res.status(401).json({ error: "Usuario no identificado" });
    }

    const history = await Analysis.find({ user: currentUserId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el historial" });
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
      return res.status(401).json({ error: "Usuario no identificado" });
    }

    await Analysis.findOneAndDelete({ _id: req.params.id, user: currentUserId });
    res.json({ message: "Análisis eliminado" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el análisis" });
  }
});

router.delete("/", protect, async (req, res) => {
  try {
    const currentUserId =
      req.user?.id ||
      req.user?.userId ||
      req.user?._id ||
      null;

    if (!currentUserId) {
      return res.status(401).json({ error: "Usuario no identificado" });
    }

    await Analysis.deleteMany({ user: currentUserId });
    res.json({ message: "Historial vaciado" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo vaciar el historial" });
  }
});

export default router;
