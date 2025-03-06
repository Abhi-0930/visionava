import {Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm/Auth.jsx";
import ResetPassword from "./components/ResetPassword/ResetPassword.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Main from "./components/Main/Main.jsx";

function App() {
    return (
        
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/auth" element={<AuthForm />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
    );
}

export default App;
