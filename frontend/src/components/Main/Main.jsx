import React from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import image from "../../assets/frame.png";
const Main = () => {
  return (
    <div className="container">
      <div className="navbar-section">
        <nav>
          <ul>
            <img src={image} alt="main-logo-image" width="100" />
            <li>Home</li>
            <li>About</li>
            <li>Features</li>
            <button>
              <Link to="/auth">Login</Link>
            </button>
          </ul>
        </nav>
      </div>

      <div className="hero-section">
        <h1>Empathy AI</h1>
        <p>Understand your emotions like never before</p>
        <button>Try Now</button>
      </div>

      <div className="about-section">
        <div className="left-about-section">
          <img src={image} alt="about-chat-image" width="200" />
        </div>
        <div className="right-about-section">
          <h3>How We Help</h3>
          <p>
            We use AI to help users understand their emotions through multiple
            forms of communication
          </p>
          <h4>The features we provide</h4>
          <ul>
            <li>Text,Voice and Video Analysis</li>
            <li>Real-time emotional feedback</li>
            <li>Personalized wellness insights</li>
          </ul>
        </div>
      </div>

      <div className="why-choose-us">
        <p>Emotion Detection</p>
        <p>Multiple mode of communication analysis</p>
        <p>Personalized feedback</p>
      </div>

      <div className="working-body">
        <div className="steps">
          <div className="step1">
            <b>Step 1 :</b>
            <p>Sign Up and login to your acccount</p>
          </div>

          <div className="step2">
            <b>Step 2 :</b>
            <p>Choose your preferred chat mode: Text, Voice, or Video</p>
          </div>

          <div className="step3">
            <b>Step 3 :</b>
            <p>Receive personalized feedback and emotional insights</p>
          </div>
        </div>

        <div className="footer-section">
          <img src={image} alt="footer-logo-image" width="100" />
          <p>�� 2023 Empathy AI. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>

            <div className="social-media-icons">
              <a href="https://www.instagram.com">Instagram</a>
              <a href="https://www.x.com">X</a>
              <a href="https://www.linkedin.com">Linkedin</a>
            </div>

            <p>�� 2024 Empathy AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
