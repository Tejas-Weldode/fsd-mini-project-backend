import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    fullName: { type: String, default: "" },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Other",
    },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    notifications: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },

    notifyPostLike: { type: Boolean, default: false },
    notifyPostDislike: { type: Boolean, default: false },
    notifyPostComment: { type: Boolean, default: false },
    notifyCommentLike: { type: Boolean, default: false },
    notifyCommentDislike: { type: Boolean, default: false },
    notifyMessages: { type: Boolean, default: false },
    onlySeeImp: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;
