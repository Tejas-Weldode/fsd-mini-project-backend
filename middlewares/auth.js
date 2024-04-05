import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default auth;
