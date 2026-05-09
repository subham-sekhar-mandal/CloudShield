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
 


