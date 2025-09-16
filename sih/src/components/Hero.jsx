import React from "react";

function Hero() {
  return (
    <section className="hero">
      <h1 className="https://github.com/JahnaviNaiduu/SIH.git">YAAR -Your AI Atithi Rakshak</h1>

      <p>Wherever you go, we've got your back.</p>

      <div className="tags">
        <span className="tag blue">Blockchain IDs</span>
        <span className="tag green">AI Safety Alerts</span>
        <span className="tag red">Real-Time Emergency Response</span>
      </div>

      <div className="login-options">
        <button className="tourist-login">Tourist Login</button>
        <button className="authority-login">Authority Login</button>
        <button className="google-login">GoogleLogin</button>
      </div>

      <p className="register-text">
        Don’t have an ID? <a href="#">Register for Tourist ID</a>
      </p>
    </section>
  );
}

export default Hero;
