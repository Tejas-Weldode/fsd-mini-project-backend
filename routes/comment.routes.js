import express from "express";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import LikeDislike from "../models/likeDislike.model.js";
import auth from "../middlewares/auth.js";
import notify from "../utility/notify.js";

const router = express.Router();

// Create comment route
router.post("/create", auth, async (req, res) => {
    try {
        const { uid, postid, text } = req.body;
        const comment = new Comment({ uid, postid, text });
        await comment.save();

        // Notify the respective user if notifyPostComment is true
        const post = await Post.findById(postid);
        const user = await User.findById(post.uid);
        if (user && user.notifyPostComment) {
            await notify("Your post has received a new comment", post.uid);
        }

        res.status(201).json({ message: "Comment created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Like a comment route
router.put("/like/:id", auth, async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.userId; // Assuming req.user contains the current user's information

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user has already liked the comment
        const existingLike = await LikeDislike.findOne({
            userId,
            commentId,
            action: "like",
        });
        if (existingLike) {
            return res.status(400).json({ message: "Comment already liked" });
        }

        // Check if the user has already disliked the comment and update to like
        const existingDislike = await LikeDislike.findOne({
            userId,
            commentId,
            action: "dislike",
        });
        if (existingDislike) {
            existingDislike.action = "like";
            await existingDislike.save();
        } else {
            // If user has not disliked the comment, create a new like entry
            await LikeDislike.create({ userId, commentId, action: "like" });
        }

        // Update the comment's like count and save
        comment.likes += 1;
        await comment.save();

        // Notify the respective user if notifyCommentLike is true
        const post = await Post.findById(comment.postid);
        const user = await User.findById(post.uid);
        if (user && user.notifyCommentLike) {
            const notificationText = `Your comment has been liked by ${userId}`;
            await notify(notificationText, user._id);
        }

        res.status(200).json({ message: "Comment liked successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Dislike a comment route
router.put("/dislike/:id", auth, async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.userId; // Assuming req.user contains the current user's information

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user has already disliked the comment
        const existingDislike = await LikeDislike.findOne({
            userId,
            commentId,
            action: "dislike",
        });
        if (existingDislike) {
            return res
                .status(400)
                .json({ message: "Comment already disliked" });
        }

        // Check if the user has already liked the comment and update to dislike
        const existingLike = await LikeDislike.findOne({
            userId,
            commentId,
            action: "like",
        });
        if (existingLike) {
            existingLike.action = "dislike";
            await existingLike.save();
        } else {
            // If user has not liked the comment, create a new dislike entry
            await LikeDislike.create({ userId, commentId, action: "dislike" });
        }

        // Update the comment's dislike count and save
        comment.dislikes += 1;
        await comment.save();

        // Notify the respective user if notifyCommentDislike is true
        const post = await Post.findById(comment.postid);
        const user = await User.findById(post.uid);
        if (user && user.notifyCommentDislike) {
            const notificationText = `Your comment has been disliked by ${userId}`;
            await notify(notificationText, user._id);
        }

        res.status(200).json({ message: "Comment disliked successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get comments by post ID route
router.get("/post/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ postid: req.params.postId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
