import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
