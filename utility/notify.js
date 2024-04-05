import Notification from "../models/notification.model.js";

const notify = async (text, uid) => {
    try {
        const notification = new Notification({ text, uid });
        await notification.save();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default notify;
