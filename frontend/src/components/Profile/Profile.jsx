import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        let token = localStorage.getItem("token");

        // Check if token is in URL (for Google login)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("token")) {
            token = urlParams.get("token");
            localStorage.setItem("token", token);
            navigate("/profile"); // Remove token from URL
        }

        if (!token) {
            navigate("/");
            return;
        }

        fetch("http://localhost:3000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Unauthorized") {
                navigate("/");
            } else {
                setUser(data);
            }
        });
    }, [navigate]);

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <h2>Profile</h2>
            {user ? (
                <>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }}>Logout</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;
