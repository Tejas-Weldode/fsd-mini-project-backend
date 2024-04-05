import mongoose from "mongoose";

const networkSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, required: true },
    follower: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Network = mongoose.model("Network", networkSchema);

export default Network;
