import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, "your_secret_key", {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Edit profile route
router.put("/edit-profile", auth, async (req, res) => {
    try {
        const {
            bio,
            profilePic,
            fullName,
            gender,
            notifyPostLike,
            notifyPostDislike,
            notifyPostComment,
            notifyCommentLike,
            notifyCommentDislike,
            notifyMessages,
            onlySeeImp,
        } = req.body;
        const userId = req.userId;
        await User.findByIdAndUpdate(userId, {
            bio,
            profilePic,
            fullName,
            gender,
            notifyPostLike,
            notifyPostDislike,
            notifyPostComment,
            notifyCommentLike,
            notifyCommentDislike,
            notifyMessages,
            onlySeeImp,
        });
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
