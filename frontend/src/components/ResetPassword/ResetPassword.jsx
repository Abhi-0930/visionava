import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();
            setMessage(data.message);
            if (data.message === "Password reset successfully") {
                setTimeout(() => navigate("/"), 2000);
            }
        } catch (error) {
            setMessage("Failed to connect to the server");
            console.log(error.message)
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <button type="submit">Reset Password</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default ResetPassword;
