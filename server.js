// Import required modules
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import messageRoutes from "./routes/message.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import networkRoutes from "./routes/network.routes.js";

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/message", messageRoutes);
app.use("/notification", notificationRoutes);
app.use("/network", networkRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        // Start server
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
