import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthForm() {
    const [view, setView] = useState("login");
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();
        setMessage("");

        let requestData = { ...formData };
        if (endpoint === "login") delete requestData.username;

        try {
            const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setMessage(data.message || "Success");

            if (endpoint === "login") {
                localStorage.setItem("token", data.token);
                navigate("/profile");
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleGoogleSignIn = () => {
        window.location.href = "http://localhost:3000/api/auth/google";
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center", fontFamily: "Arial" }}>
            <h2>{view === "login" ? "Login" : view === "signup" ? "Sign Up" : "Forgot Password"}</h2>

            <form onSubmit={(e) => handleSubmit(e, view)}>
                {view === "signup" && (
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                )}
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                {view !== "forgot-password" && (
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                )}
                <button type="submit">{view === "login" ? "Login" : view === "signup" ? "Sign Up" : "Send Reset Link"}</button>
            </form>

            <button onClick={handleGoogleSignIn} style={{ marginTop: "10px", background: "red", color: "white", padding: "10px", border: "none", cursor: "pointer" }}>
                Sign in with Google
            </button>

            <p style={{ color: "green" }}>{message}</p>

            {view !== "login" && <p onClick={() => setView("login")} style={{ cursor: "pointer", color: "blue" }}>Login</p>}
            {view !== "signup" && <p onClick={() => setView("signup")} style={{ cursor: "pointer", color: "blue" }}>Sign Up</p>}
            {view !== "forgot-password" && <p onClick={() => setView("forgot-password")} style={{ cursor: "pointer", color: "blue" }}>Forgot Password?</p>}
        </div>
    );
}

export default AuthForm;
