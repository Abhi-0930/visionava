import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Plus,
  Search,
  Send,
  Image,
  Video,
  Mic,
  User,
  Moon,
  Sun,
  LogOut,
  Edit,
  Settings,
  Menu,
  X,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import "./Chatbot.css";
import { useNavigate } from "react-router-dom";

const MentalHealthChatbot = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [inputMode, setInputMode] = useState("text");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState(""); // <-- Add this line to declare `input` state
  const messagesEndRef = useRef(null);
  const textInputRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch user profile and chats on component mount
  useEffect(() => {
    const fetchUserAndChats = async () => {
      const token = localStorage.getItem("token");

      // Fetch user profile
      const userResponse = await fetch("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();
      if (userResponse.ok) {
        setUser(userData);
      } else {
        navigate("/");
        return;
      }

      // Fetch chats
      const chatsResponse = await fetch("http://localhost:3000/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const chatsData = await chatsResponse.json();
      if (chatsResponse.ok) {
        setChats(chatsData);
      } else {
        console.error("Failed to fetch chats:", chatsData.message);
      }
    };

    fetchUserAndChats();
  }, [navigate]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Theme toggling
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return; // <-- Now `input` is defined

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getRandomResponse(),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);

      // Update chat list
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === activeChat
            ? { ...chat, lastMessage: botResponse.text.substring(0, 40) + "..." }
            : chat
        )
      );
    }, 1000);
  };

  // Handle creating a new chat
  const handleNewChat = async () => {
    const token = localStorage.getItem("token");
    const newChat = {
      title: `New Session ${chats.length + 1}`,
      lastMessage: "How may I help you today?",
      timestamp: new Date(),
    };

    const response = await fetch("http://localhost:3000/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newChat),
    });

    if (response.ok) {
      const data = await response.json();
      setChats((prev) => [data, ...prev]);
      setActiveChat(data._id);
      setMessages([
        {
          id: 1,
          text: `Hello, ${user.username}. How may I help you today?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } else {
      console.error("Failed to create new chat");
    }
  };

  // Handle deleting a chat
  const handleDeleteChat = async (chatId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3000/api/chats/${chatId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const updatedChats = chats.filter((chat) => chat._id !== chatId);
      setChats(updatedChats);
      if (activeChat === chatId) {
        setActiveChat(null);
        setMessages([]);
      }
    } else {
      console.error("Failed to delete chat");
    }
  };

  // Sample responses
  const getRandomResponse = () => {
    const responses = [
      "How does that make you feel?",
      "Tell me more about that experience.",
      "I notice you seem to be feeling frustrated. Would you like to explore that further?",
      "That sounds challenging. How have you been coping with it?",
      "I'm here to listen. Would you like to share more about what's on your mind?",
      "Let's take a moment to recognize the progress you've made so far.",
      "Have you tried any relaxation techniques when you feel this way?",
      "What thoughts come up for you when you experience this situation?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Filter chats based on search query
  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      {/* Mobile menu toggle */}
      <div className="mobile-menu-toggle">
        {isMobileMenuOpen ? (
          <X size={24} onClick={() => setIsMobileMenuOpen(false)} />
        ) : (
          <Menu size={24} onClick={() => setIsMobileMenuOpen(true)} />
        )}
      </div>

      {/* Left sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">MindfulChat</h2>
          <button className="new-chat-btn" onClick={handleNewChat}>
            <Plus size={20} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="chats-list">
          {filteredChats.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${activeChat === chat._id ? "active" : ""}`}
              onClick={() => setActiveChat(chat._id)}
            >
              <div className="chat-icon">
                <MessageCircle size={20} />
              </div>
              <div className="chat-details">
                <div className="chat-title">{chat.title}</div>
                <div className="chat-message">{chat.lastMessage}</div>
              </div>
              <div className="chat-meta">
                <div className="chat-time">{formatDate(new Date(chat.timestamp))}</div>
              </div>
              {/* Delete Button */}
              <div
                className="delete-chat-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat._id);
                }}
              >
                <Trash2 size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="main-content">
        <div className="chat-header">
          <div className="chat-info">
            <h3>Session {activeChat}</h3>
          </div>
          <div className="profile-container">
            <div className="emergency-button">
              <AlertTriangle size={20} />
              <span>Emergency</span>
            </div>
            <div
              className="profile-icon"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <User size={24} />
            </div>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-item">
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </div>
                <div className="dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </div>
                <div className="dropdown-item">
                  <LogOut size={16} />
                  <span
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/");
                    }}
                  >
                    Logout
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              <div className="message-content">
                <p>{message.text}</p>
              </div>
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-mode-selector">
            <button
              className={`input-mode-btn ${
                inputMode === "text" ? "active" : ""
              }`}
              onClick={() => setInputMode("text")}
            >
              <MessageCircle size={20} />
            </button>
            <button
              className={`input-mode-btn ${
                inputMode === "image" ? "active" : ""
              }`}
              onClick={() => setInputMode("image")}
            >
              <Image size={20} />
            </button>
            <button
              className={`input-mode-btn ${
                inputMode === "video" ? "active" : ""
              }`}
              onClick={() => setInputMode("video")}
            >
              <Video size={20} />
            </button>
            <button
              className={`input-mode-btn ${
                inputMode === "voice" ? "active" : ""
              }`}
              onClick={() => setInputMode("voice")}
            >
              <Mic size={20} />
            </button>
          </div>

          <div className="text-input-wrapper">
            <input
              type="text"
              className="text-input"
              placeholder={`Type a message (${inputMode} mode)...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              ref={textInputRef}
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!input.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthChatbot;