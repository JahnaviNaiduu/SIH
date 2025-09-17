import React, { useState } from "react";

function Navbar() {
  const [language, setLanguage] = useState("English");
  const [status, setStatus] = useState("");
  const [sosActive, setSosActive] = useState(false);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // SOS click handler
  const handleSOS = () => {
    alert("🚨 SOS Activated! Authorities have been notified.");
    setStatus("🚨 SOS Triggered | Help is on the way");
    setSosActive(true);
  };

  // Share Location click handler
  const handleShareLocation = () => {
    alert("📍 Location shared with emergency contacts.");
    setStatus("📍 Location Shared | Stay Safe");
  };

  // Monitoring click handler
  const handleMonitoringPress = () => {
    alert("📡 Monitoring Active: Live tracking started.");
    setStatus("✅ Monitoring Active | You are in a Safe Zone");
  };

  return (
    <nav className="navbar">
      <div className="brand-text">
        <span className="gradient-text">🌐YAAR</span>
      </div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Itenary</li>
        <li>Maps</li>
        <li>Help</li>

        <li className="sos-wrapper">
          {!sosActive ? (
            <>
              <button className="sos-circle" onClick={handleSOS}>
                SOS
              </button>
            </>
          ) : (
            <div className="sos-actions">
              <button className="sos-btn" onClick={handleSOS}>
                🆘 SOS
              </button>
              <button className="share-btn" onClick={handleShareLocation}>
                📍 Share
              </button>
            </div>
          )}
        </li>

        <li>
          <button className="monitor-btn" onClick={handleMonitoringPress}>
            Monitoring
          </button>
        </li>
      </ul>

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

      {/* Status message inline */}
      {status && <div className="status-banner">{status}</div>}
    </nav>
  );
}

export default Navbar;
