import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <h1>
        YAAR
      </h1>
        <p>
          Revolutionizing tourism safety with blockchain-verified digital
          identities, AI-powered risk assessment, and real-time emergency
          response systems. Travel smart, travel safe, wherever your journey
          takes you.
        </p>
      </div>

      <div className="footer-middle">
        <div>
          <h4>Secured by Blockchain</h4>
          <h4>Powered by AI</h4>
          <h4>Trusted by Tourism Dept.</h4>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Features</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Contact Us</li>
            <li>Help Center</li>
          </ul>
        </div>
        <div>
          <h4>Emergency Contacts</h4>
          <ul>
            <li>Tourist Helpline: 1363 (24/7)</li>
            <li>Police Emergency: 100 (24/7)</li>
            <li>Medical Emergency: 108 (24/7)</li>
            <li>Fire Emergency: 101 (24/7)</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>🚨 In case of emergency, press the panic button in your SmartTourSafe app for instant help.</p>
      </div>
    </footer>
  );
};

export default Footer;
