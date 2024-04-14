import express from "express";
import Network from "../models/network.model.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// toggle follow-unfollow
router.post("/follow-unfollow", auth, async (req, res) => {
    try {
        const { uid } = req.body;
        const follower = req.userId;
        const existingNetwork = await Network.findOne({ uid, follower });
        if (existingNetwork) {
            await Network.findByIdAndDelete(existingNetwork._id);
            return res
                .status(201)
                .json({ message: "User unfollowed successfully" });
        }
        const network = new Network({ uid, follower });
        await network.save();
        res.status(201).json({ message: "User followed successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Follow user route
router.post("/follow", auth, async (req, res) => {
    try {
        const { uid } = req.body;
        const follower = req.userId;
        const existingNetwork = await Network.findOne({ uid, follower });
        if (existingNetwork) {
            return res
                .status(400)
                .json({ message: "Already following this user" });
        }
        const network = new Network({ uid, follower });
        await network.save();
        res.status(201).json({ message: "User followed successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Unfollow user route
router.delete("/unfollow", auth, async (req, res) => {
    try {
        const { uid } = req.body;
        const follower = req.userId;
        const network = await Network.findOneAndDelete({ uid, follower });
        if (!network) {
            return res
                .status(404)
                .json({ message: "Network connection not found" });
        }
        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get followers route
router.get("/followers", auth, async (req, res) => {
    try {
        const followers = await Network.find({
            uid: req.body.userId,
        }).populate("follower", "username profilePic fullName");
        res.status(200).json(
            followers.map((follower) => ({
                username: follower.follower.username,
                profilePic: follower.follower.profilePic,
                fullName: follower.follower.fullName,
            }))
        );
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get following route
router.get("/following", auth, async (req, res) => {
    try {
        const following = await Network.find({
            follower: req.userId,
        }).populate("uid", "username profilePic fullName");
        res.status(200).json(
            following.map((user) => ({
                _id: user.uid._id,
                username: user.uid.username,
                profilePic: user.uid.profilePic,
                fullName: user.uid.fullName,
            }))
        );
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
