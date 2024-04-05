import mongoose from "mongoose";

const likeDislikeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, enum: ["like", "dislike"], required: true },
});

const LikeDislike = mongoose.model("LikeDislike", likeDislikeSchema);

export default LikeDislike;
