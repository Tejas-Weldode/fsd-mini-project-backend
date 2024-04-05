import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, required: true },
    postid: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
