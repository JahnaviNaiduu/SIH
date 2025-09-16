import React from "react";
import "./Features.css";

const Features = () => {
  const featureList = [
    { title: "🌐 Digital Tourist ID", desc: "Blockchain-secured digital identity for secure travel verification and seamless border crossings." },
    { title: "📍 Geo-fence Alerts", desc: "Real-time location-based safety warnings and restricted area notifications with smart routing." },
    { title: "🚨 Panic Button", desc: "One-touch emergency response connecting you instantly to local authorities and emergency contacts. An E-FIR is automatically generated on the Police Dashboard." },
    { title: "🤖 AI Safety Score", desc: "Intelligent risk assessment based on real-time data, weather, local events, and crowd analysis." },
    { title: "🎎 Cultural Sensitivity Alerts", desc: "Smart notifications about local customs, dress codes, and cultural practices to ensure respectful travel." },
    { title: "👥 Tourist Safety Network", desc: "Connect with nearby verified travelers and form safety groups for enhanced mutual protection." },
    { title: "📡 Offline Emergency Mode", desc: "Critical safety features work even without internet connection using satellite emergency protocols." },
    { title: "🎖️ Dynamic Safety Badge", desc: "AI-powered real-time safety status indicator that updates based on your current location and activities." },

    // ✅ Newly added features
    { title: "🗺️ Offline Maps (Dead Zones)", desc: "Download maps in advance to access navigation and safety zones even without internet connectivity." },
    { title: "👮 E-FIR on Police Dashboard", desc: "When a panic alert is triggered, an electronic FIR is automatically created on the police authority dashboard." },
    { title: "🔑 Tourist Login (Google)", desc: "Seamless tourist access with Google Login for quick authentication and access to safety tools." },
  ];

  return (
    <section className="features">
      {/* ✅ Heading always on top */}
      <div className="features-header">
        <h2 className="features-heading">
  <span className="symbol">🛡️</span>
  <span className="gradient-text">Advanced Safety Features</span>
</h2>

        <p className="features-subtitle">
          Comprehensive protection powered by blockchain security, AI intelligence, and real-time connectivity.
        </p>
      </div>

      {/* ✅ Cards grid comes below */}
      <div className="features-grid">
        {featureList.map((f, index) => (
          <div key={index} className="feature-card">
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
