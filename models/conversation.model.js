import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    uid1: { type: mongoose.Schema.Types.ObjectId, required: true },
    uid2: { type: mongoose.Schema.Types.ObjectId, required: true },
    uid1Mute: { type: Boolean, default: false },
    uid2Mute: { type: Boolean, default: false },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
