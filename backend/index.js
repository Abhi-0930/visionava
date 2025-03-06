import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/user.route.js";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173", 
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json()); 

app.use("/api/auth", authRoutes);
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
    res.send("Hello, Visionava!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
