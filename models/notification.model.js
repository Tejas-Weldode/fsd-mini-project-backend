import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    text: { type: String, required: true },
    uid: { type: mongoose.Schema.Types.ObjectId, required: true },
    read: { type: Boolean, default: false },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
