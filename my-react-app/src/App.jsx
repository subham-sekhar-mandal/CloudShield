import { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "8f1845cc3279431227fdfde78b07f880";

function App() {
  const [city, setCity]       = useState("");
  const [weather, setWeather] = useState(null);
  const [risk, setRisk]       = useState(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // ── Risk calculation whenever new weather arrives ──────────────────────
  useEffect(() => {
    if (!weather) return;

    const rainfall  = Math.floor(Math.random() * 300);
    const humidity  = weather.main.humidity;
    const windSpeed = weather.wind.speed;

    let level, message, className;

    if (rainfall > 200 && humidity > 80 && windSpeed > 5) {
      level     = "HIGH RISK";
      message   = "⚠️ Cloudburst Warning! Take shelter immediately.";
      className = "risk-box high";
    } else if (rainfall > 100) {
      level     = "MEDIUM RISK";
      message   = "⚠️ Weather unstable. Stay alert.";
      className = "risk-box medium";
    } else {
      level     = "LOW RISK";
      message   = "✅ All clear. Conditions are normal.";
      className = "risk-box low";
    }

    setRisk({ level, message, className, rainfall });
  }, [weather]);

 

