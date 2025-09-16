import React, { useState } from "react";

function Navbar() {
  // state for language
  const [language, setLanguage] = useState("English");

  // handler for language change
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <nav className="navbar">
      {/* Brand name */}
      <div className="brand-text">
        <span className="blue">🌐Smart</span>
        <span className="green">TourSafe</span>
      </div>

      {/* Middle: Navigation links */}
      <ul className="nav-links">
        <li>Home</li>
        <li>Features</li>
        <li>Languages</li>
        <li>Help</li>
      </ul>

      {/* Right: Language, Login, Register */}
      <div className="nav-actions">
        <select
          className="lang-select"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
          <option value="German">German</option>
          <option value="Hindi">Hindi</option>
        </select>
        <span className="login-link">Login</span>
        <button className="register-btn">Register</button>
      </div>
    </nav>
  );
}

export default Navbar;
