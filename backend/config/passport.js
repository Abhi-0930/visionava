import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value });
                if (!user) {
                    user = new User({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        password: "", // No password needed for Google sign-in
                    });
                    await user.save();
                }
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return done(null, { user, token });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});
