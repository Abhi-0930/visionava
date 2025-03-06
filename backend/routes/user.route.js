import express from "express";
import { signup, login, forgotPassword, resetPassword, profile } from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import passport from 'passport'
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", authenticateUser, profile);


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect(`http://localhost:5173/profile?token=${req.user.token}`);
    }
);


export default router;
