import express from "express";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Create conversation route
router.post("/create", auth, async (req, res) => {
    try {
        const { uid1, uid2 } = req.body;
        const conversation = new Conversation({ uid1, uid2 });
        await conversation.save();
        res.status(201).json({ message: "Conversation created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all conversations route
router.get("/", async (req, res) => {
    try {
        const conversations = await Conversation.find();
        res.status(200).json(conversations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get conversation by ID route
router.get("/:id", async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        res.status(200).json(conversation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update conversation route
router.put("/:id", auth, async (req, res) => {
    try {
        const { uid1Mute, uid2Mute } = req.body;
        await Conversation.findByIdAndUpdate(req.params.id, {
            uid1Mute,
            uid2Mute,
        });
        res.status(200).json({ message: "Conversation updated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete conversation route
router.delete("/:id", auth, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // Delete associated messages
        await Message.deleteMany({ conversationId: req.params.id });

        // Delete the conversation
        await Conversation.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
