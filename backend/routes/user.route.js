import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  profile,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const router = express.Router();
const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID"); // Replace with your client ID

// Regular routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", authenticateUser, profile);

// Google Sign-In route
router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "YOUR_GOOGLE_CLIENT_ID", // Replace with your client ID
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Find or create the user in your database
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: name,
        email,
        password: "", // No password needed for Google sign-in
      });
      await user.save();
    }

    // Generate a JWT for your app
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token: appToken });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(400).json({ message: "Invalid token" });
  }
});

// Fetch user chats
router.get("/api/chats", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID
    const chats = await UsersChat.find({ userId }).sort({ timestamp: -1 }); // Fetch chats for the user
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch user chats
router.get("/api/chats", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID
    const chats = await UsersChat.find({ userId }).sort({ timestamp: -1 }); // Fetch chats for the user
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/api/chats", authenticateUser, async (req, res) => {
  try {
    const { title, lastMessage } = req.body;
    const userId = req.user.id;

    const newChat = new UsersChat({
      userId,
      title,
      lastMessage,
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a chat
router.delete("/api/chats/:id", authenticateUser, async (req, res) => {
  try {
    const chatId = req.params.id;
    await UsersChat.findByIdAndDelete(chatId); // Delete the chat by ID
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
