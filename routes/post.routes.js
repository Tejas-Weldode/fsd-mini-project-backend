import express from "express";
import Post from "../models/post.model.js";
import Image from "../models/image.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import Network from "../models/network.model.js";
import LikeDislike from "../models/likeDislike.model.js";
import auth from "../middlewares/auth.js";
import notify from "../utility/notify.js";

const router = express.Router();

// Create post route
router.post("/create", auth, async (req, res) => {
    try {
        const {caption, visibility, imp, images } = req.body;
        const imageIds = [];

        if (images) {
            for (const imageData of images) {
                const image = new Image({ data: imageData });
                await image.save();
                imageIds.push(image._id);
            }
        }

        const post = new Post({
            uid: req.userId,
            caption,
            visibility,
            imp,
            images: imageIds,
        });
        await post.save();

        res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get posts route
router.get("/following-posts", auth, async (req, res) => {
    try {
        // if user wants only important posts
        const onlySeeImp = await User.find({
            _id: req.userId,
            onlySeeImp: true,
        });
        const posts = null;

        const following = await Network.find({ follower: currentUser._id });
        const followingIds = following.map((e) => e.uid);

        if (onlySeeImp)
            posts = await Post.find({
                imp: true,
                uid: { $in: followingIds },
            }).populate("images");
        else posts = await Post.find().populate("images");
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get posts route
router.get("/public-posts", auth, async (req, res) => {
    try {
        // if user wants only important posts
        const user = await User.find({
            _id: req.userId,
            onlySeeImp: true,
        });
        let posts = null;

        if (user.onlySeeImp)
            posts = await Post.find({ imp: true }).populate("images");
        else posts = await Post.find().populate("images");
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get post by ID route
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("images");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update post by id route
router.put("/:id", auth, async (req, res) => {
    try {
        const { caption, visibility, imp, images } = req.body;
        const imageIds = [];

        for (const imageData of images) {
            const image = new Image({ data: imageData });
            await image.save();
            imageIds.push(image._id);
        }

        await Post.findByIdAndUpdate(req.params.id, {
            caption,
            visibility,
            imp,
            images: imageIds,
        });
        res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Like a post route
router.put("/like/:id", auth, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId; // Assuming req.user contains the current user's information

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user has already liked the post
        const existingLike = await LikeDislike.findOne({
            userId,
            postId,
            action: "like",
        });
        if (existingLike) {
            return res.status(400).json({ message: "Post already liked" });
        }

        // Check if the user has already disliked the post and update to like
        const existingDislike = await LikeDislike.findOne({
            userId,
            postId,
            action: "dislike",
        });
        if (existingDislike) {
            existingDislike.action = "like";
            await existingDislike.save();
        } else {
            // If user has not disliked the post, create a new like entry
            await LikeDislike.create({ userId, postId, action: "like" });
        }

        // Update the post's like count and save
        post.likes += 1;
        await post.save();

        // Notify the respective user if notifyPostLike is true
        const user = await User.findById(post.uid);
        if (user && user.notifyPostLike) {
            await notify("Your post has been liked by", post.uid);
        }

        res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Dislike a post route
router.put("/dislike/:id", auth, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId; // Assuming req.user contains the current user's information

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user has already disliked the post
        const existingDislike = await LikeDislike.findOne({
            userId,
            postId,
            action: "dislike",
        });
        if (existingDislike) {
            return res.status(400).json({ message: "Post already disliked" });
        }

        // Check if the user has already liked the post and update to dislike
        const existingLike = await LikeDislike.findOne({
            userId,
            postId,
            action: "like",
        });
        if (existingLike) {
            existingLike.action = "dislike";
            await existingLike.save();
        } else {
            // If user has not liked the post, create a new dislike entry
            await LikeDislike.create({ userId, postId, action: "dislike" });
        }

        // Update the post's dislike count and save
        post.dislikes += 1;
        await post.save();

        // Notify the respective user if notifyPostDislike is true
        const user = await User.findById(post.uid);
        if (user && user.notifyPostDislike) {
            await notify("Your post has been disliked", post.uid);
        }

        res.status(200).json({ message: "Post disliked successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete post by id route
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Delete associated images
        for (const imageId of post.images) {
            await Image.findByIdAndDelete(imageId);
        }
        // Delete associated comments
        await Comment.deleteMany({ postid: req.params.id });
        // Delete the post
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
