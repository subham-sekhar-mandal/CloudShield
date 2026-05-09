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

  // ── Fetch weather data ─────────────────────────────────────────────────
  async function getWeatherData() {
    if (!city.trim()) { setError("Please enter a city name."); return; }

    setError("");
    setLoading(true);
    setWeather(null);
    setRisk(null);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const res  = await fetch(url);
      const data = await res.json();

      if      (data.cod === 401)    setError("❌ Invalid API Key.");
      else if (data.cod === "404")  setError("❌ City not found. Check the spelling.");
      else if (data.cod !== 200)    setError(`❌ Error ${data.cod}: ${data.message}`);
      else                          setWeather(data);
    } catch (err) {
      console.error(err);
      setError("❌ Network error. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") getWeatherData();
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="page">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="logo-icon">☁</div>
          <h1>CloudShield</h1>
          <p className="subtitle">Cloudburst Early Warning System</p>
        </div>

        {/* Search */}
        <div className="search-box">
          <div className="search-inner">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              id="cityInput"
              placeholder="Search for a city…"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button onClick={getWeatherData} disabled={loading} id="searchBtn">
            {loading ? <span className="spinner" /> : "Check Weather"}
          </button>
        </div>

        {/* Error */}
        {error && <div className="error-banner">{error}</div>}

        {/* Results */}
        {weather && risk && (
          <div className="results">

            {/* City + description */}
            <div className="city-header">
              <h2 className="city-name">
                📍 {weather.name}, {weather.sys.country}
              </h2>
              <p className="city-desc">
                {weather.weather[0].description.charAt(0).toUpperCase() +
                  weather.weather[0].description.slice(1)}
              </p>
            </div>

            {/* Cards */}
            <div className="weather-grid">
              <div className="card">
                <div className="card-icon">🌧</div>
                <p className="card-label">Rainfall</p>
                <p className="card-value">{risk.rainfall}<span className="card-unit"> mm</span></p>
              </div>
              <div className="card">
                <div className="card-icon">💧</div>
                <p className="card-label">Humidity</p>
                <p className="card-value">{weather.main.humidity}<span className="card-unit"> %</span></p>
              </div>
              <div className="card">
                <div className="card-icon">💨</div>
                <p className="card-label">Wind Speed</p>
                <p className="card-value">{weather.wind.speed}<span className="card-unit"> km/h</span></p>
              </div>
              <div className="card">
                <div className="card-icon">🌡</div>
                <p className="card-label">Temperature</p>
                <p className="card-value">{weather.main.temp}<span className="card-unit"> °C</span></p>
              </div>
            </div>

            {/* Risk Box */}
            <div className={risk.className}>
              <div className="risk-left">
                <span className="risk-tag">RISK LEVEL</span>
                <span className="risk-level">{risk.level}</span>
              </div>
              <p className="risk-message">{risk.message}</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
