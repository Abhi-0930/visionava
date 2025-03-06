import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/i,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExpiry: Date,
},{timestamps:true});

const User = mongoose.model("User", userSchema);

export default User;
