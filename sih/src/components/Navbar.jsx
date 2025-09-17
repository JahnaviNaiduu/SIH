import React, { useState } from "react";

function Navbar() {
  const [language, setLanguage] = useState("English");
  const [status, setStatus] = useState("");
  const [sosActive, setSosActive] = useState(false);
  const [monitoring, setMonitoring] = useState("");

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // SOS click handler
  const handleSOS = () => {
    // Step 1: Trigger KYC confirmation
    const isKycDone = window.confirm("⚠️ KYC verification required. Proceed?");
    if (isKycDone) {
      // Step 2: Direct to emergency dialer
      window.location.href = "tel:101";

      // Step 3: Update status
      setStatus("🚨 SOS Triggered | Contacting Emergency Services (101)...");
      setSosActive(true);
    } else {
      setStatus("❌ SOS Cancelled | KYC not completed");
    }
  };

  // Share Location click handler
  const handleShareLocation = () => {
    alert("📍 Location shared with emergency contacts.");
    setStatus("📍 Location Shared | Stay Safe");
  };

  // Monitoring toggle handler
  const handleMonitoringPress = () => {
    if (monitoring === "✅ Monitoring Active | Safe Zone") {
      setMonitoring("📶 Offline Mode Active");
    } else {
      setMonitoring("✅ Monitoring Active | Safe Zone");
    }
    setStatus(""); // clear SOS status when monitoring changes
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
        <li>Profile</li>

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
            {monitoring ? monitoring : "Monitoring"}
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
      {(status || monitoring) && (
        <div className="status-banner">{status || monitoring}</div>
      )}
    </nav>
  );
}

export default Navbar;
