import express from "express";
import Image from "../models/image.model.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Upload image route
router.post("/upload", auth, async (req, res) => {
    try {
        const { data } = req.body;
        const image = new Image({ data });
        await image.save();
        res.status(201).json({ message: "Image uploaded successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get image route
router.get("/:id", auth, async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        res.status(200).json({ data: image.data });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
