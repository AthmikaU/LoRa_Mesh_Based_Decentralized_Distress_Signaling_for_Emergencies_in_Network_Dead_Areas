import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import "./UserDashboard.css";

const UserDashboard = ({ setToken }) => {
  const [signals, setSignals] = useState([]);
  const [filteredSignals, setFilteredSignals] = useState([]);
  const [typeFilter, setTypeFilter] = useState("throughMine"); // ✅ Default
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("week");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { nodeID } = useParams();

  // === Fetch Signals ===
  const fetchSignals = useCallback(async () => {
    try {
      const res = await api.get("/getdistresses");
      const data = Array.isArray(res.data) ? res.data : [];

      const mapped = data.map((sig) => ({
        ...sig,
        coordsArray:
          typeof sig.coordinates === "string"
            ? sig.coordinates.split("/").map((c) => c.trim())
            : [],
      }));

      mapped.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setSignals(mapped);
    } catch (err) {
      console.error("Error fetching signals:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 10000);
    return () => clearInterval(interval);
  }, [fetchSignals]);

  // === Filter Logic ===
  useEffect(() => {
    const now = new Date();
    const dayLimits = {
      threeHours: 0.125,
      day: 1,
      week: 7,
      month: 30,
      threeMonths: 90,
      year: 365,
    };
    const limitDays = dayLimits[timeFilter] || 7;

    let filtered = signals.filter((sig) => {
      const created = new Date(sig.timestamp || sig.createdAt);
      const diffDays = (now - created) / (1000 * 60 * 60 * 24);
      if (timeFilter !== "all" && diffDays > limitDays) return false;

      const coords = sig.coordsArray || [];
      const isRelayed = coords.length > 1;
      const senderNode = String(sig.nodeID);
      const involvedRelay =
        sig.relayedNodes?.some((r) => String(r.nodeID) === String(nodeID)) ||
        false;
      const isMine = senderNode === String(nodeID);

      // === Type Filter ===
      switch (typeFilter) {
        case "directMine":
          return !isRelayed && isMine;
        case "relayedThroughMine":
          return isRelayed && involvedRelay;
        case "throughMine": // Combined default
          return isMine || involvedRelay;
        case "all":
        default:
          return true;
      }
    });

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (sig) =>
          sig.actionStatus?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setFilteredSignals(filtered);
  }, [signals, typeFilter, statusFilter, timeFilter, nodeID]);

  // === Logout ===
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/");
  };

  // === Map Functions ===
  const openMap = (coord) => {
    window.open(`https://www.google.com/maps?q=${coord}`, "_blank");
  };

  const openMapPath = (coordsArray) => {
    if (!coordsArray || coordsArray.length === 0) return;
    const waypoints = coordsArray.join("/");
    window.open(`https://www.google.com/maps/dir/${waypoints}`, "_blank");
  };

  return (
    <div className="user-dashboard">
      {/* HEADER */}
      <header className="header">
        <h2>LoRa Emergency Signal Tracker (User Dashboard) — Node ID #{nodeID}</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* FILTERS BELOW HEADER */}
      <div className="filter-panel">
        <div className="filter-group">
          <label>Time:</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="threeHours">Last 3 Hours</option>
            <option value="day">Last 1 Day</option>
            <option value="week">Last 1 Week</option>
            <option value="month">Last 1 Month</option>
            <option value="threeMonths">Last 3 Months</option>
            <option value="year">Last 1 Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="throughMine">Signals Relayed Through My Device</option>
            <option value="directMine">Direct from My Device</option>
            <option value="relayedThroughMine">Relayed through My Device</option>
            <option value="all">All Signals</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Action Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="working">Working</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* SIGNAL CARDS */}
      {loading ? (
        <p className="loading">Loading signals...</p>
      ) : filteredSignals.length === 0 ? (
        <p className="no-data">No distress signals found.</p>
      ) : (
        <div className="signal-grid">
          {filteredSignals.map((signal) => {
            const coordsArray = signal.coordsArray || [];
            const isRelayed = coordsArray.length > 1;

            return (
              <div className="signal-card" key={signal._id}>
                <div className="signal-header">
                  <h3>
                    Signal {signal.seqNo} ({isRelayed ? "Relayed" : "Direct"})
                  </h3>
                  <span
                    className={`status-badge ${
                      signal.actionStatus?.toLowerCase() || "pending"
                    }`}
                  >
                    {signal.actionStatus || "Pending"}
                  </span>
                </div>

                <div className="signal-details">
                  <p>
                    <b>Message:</b> {signal.message}
                  </p>
                  <p>
                    <b>Origin Node:</b> {signal.nodeID}
                  </p>
                  <p>
                    <b>Timestamp:</b>{" "}
                    {new Date(signal.timestamp).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="signal-path">
                  <b>Signal Path:</b>
                  <ul>
                    {signal.relayedNodes?.length > 0
                      ? signal.relayedNodes.map((n, i) => (
                          <li key={i}>
                            Node {n.nodeID}: {n.coordinates}{" "}
                            <button
                              className="map-btn"
                              onClick={() => openMap(n.coordinates)}
                            >
                              🗺️
                            </button>
                          </li>
                        ))
                      : coordsArray.map((coord, i) => (
                          <li key={i}>
                            {isRelayed ? `Hop ${i + 1}: ` : ""}
                            {coord}{" "}
                            <button
                              className="map-btn"
                              onClick={() => openMap(coord)}
                            >
                              🗺️
                            </button>
                          </li>
                        ))}
                  </ul>
                </div>

                {isRelayed && (
                  <button
                    className="view-path-btn"
                    onClick={() => openMapPath(coordsArray)}
                  >
                    🌐 View Full Route
                  </button>
                )}

                <p className="signal-note">
                  {isRelayed
                    ? "🔁 Relayed through multiple nodes"
                    : "📡 Direct distress signal"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
