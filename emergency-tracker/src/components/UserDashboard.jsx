import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

// Helper: Open full path on Google Maps
export const openGoogleMaps = (coordsArray) => {
  if (!coordsArray || coordsArray.length === 0) return;
  const waypoints = coordsArray.join("/");
  const mapUrl = `https://www.google.com/maps/dir/${waypoints}`;
  window.open(mapUrl, "_blank");
};

const UserDashboard = ({ nodeID: propNodeID, setToken }) => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const nodeID = propNodeID ?? localStorage.getItem("nodeID") ?? "";

  // Fetch and sort signals
  useEffect(() => {
    let isMounted = true;

    const fetchSignals = async () => {
      try {
        const res = await axios.get("http://localhost:8000/getdistresses");
        if (!isMounted) return;

        const allSignals = Array.isArray(res.data) ? res.data : [];
        const mapped = allSignals.map((sig) => {
          const coordsArray =
            typeof sig.coordinates === "string"
              ? sig.coordinates.split("/").map((s) => s.trim()).filter(Boolean)
              : [];
          return { ...sig, coordsArray };
        });

        // Sort: prioritize current node signals, then recent
        const sorted = mapped.sort((a, b) => {
          const aMatch = String(a.nodeID) === String(nodeID);
          const bMatch = String(b.nodeID) === String(nodeID);
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
          return new Date(b.timestamp) - new Date(a.timestamp);
        });

        setSignals(sorted);
      } catch (err) {
        console.error("Error fetching signals:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSignals();
    const interval = setInterval(fetchSignals, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [nodeID]);

  const handleLogout = () => {
    localStorage.clear();
    if (setToken) setToken(null);
    navigate("/");
  };

  // Combined filtering (Type + Status)
  const filteredSignals = signals.filter((s) => {
    const isMySignal = String(s.nodeID) === String(nodeID);
    const isMultiHop = s.coordsArray.length > 1;
    const isDirect = s.coordsArray.length === 1;

    // ---- Type-based filter ----
    switch (filterType) {
      case "mySignals":
        if (!isMySignal) return false;
        break;
      case "relayed":
        if (isMySignal || !isMultiHop) return false;
        break;
      case "otherDirect":
        if (isMySignal || !isDirect) return false;
        break;
      default:
        break;
    }

    // ---- Status-based filter ----
    if (
      statusFilter !== "all" &&
      s.actionStatus?.toLowerCase() !== statusFilter.toLowerCase()
    )
      return false;

    return true;
  });

  if (loading) return <p className="loading">Loading signals...</p>;

  return (
    <div className="user-dashboard">
      {/* ===== Header ===== */}
      <header className="header">
        <h2>Node {nodeID || "—"} Dashboard</h2>
        <div className="header-controls">
          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Signals</option>
            <option value="mySignals">From My Node</option>
            <option value="relayed">Relayed Through Network</option>
            <option value="otherDirect">Other Distress (Direct)</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Working">Working</option>
            <option value="Closed">Closed</option>
          </select>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* ===== Main Grid ===== */}
      {filteredSignals.length === 0 ? (
        <p className="no-data">No distress signals found.</p>
      ) : (
        <div className="signal-grid">
          {filteredSignals.map((signal, i) => {
            const coords = signal.coordsArray;
            const isDirect = coords.length === 1;
            const isMine = String(signal.nodeID) === String(nodeID);

            return (
              <div key={i} className="signal-card">
                {/* Header */}
                <div className="signal-header">
                  <h3>{isDirect ? "Direct Signal" : "Multi-hop Signal"}</h3>
                  <span
                    className={`status-badge ${signal.actionStatus?.toLowerCase()}`}
                  >
                    {signal.actionStatus}
                  </span>
                </div>

                {/* Details */}
                <div className="signal-details">
                  <p>
                    <strong>Origin Node:</strong> {signal.nodeID}
                  </p>
                  <p>
                    <strong>Timestamp:</strong>{" "}
                    {new Date(signal.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Path Info */}
                <div className="signal-path">
                  <strong>Path:</strong>
                  <ul>
                    {coords.map((c, idx) => (
                      <li key={idx}>
                        {coords.length > 1 && `Hop ${idx + 1}: `}
                        {c}{" "}
                        <a
                          href={`https://www.google.com/maps?q=${c}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* View full path button */}
                {coords.length > 1 && (
                  <button
                    className="view-path-btn"
                    onClick={() => openGoogleMaps(coords)}
                  >
                    🗺️ View Complete Path
                  </button>
                )}

                {/* Node Origin Info */}
                <p className="signal-note">
                  {isMine
                    ? "📡 Originated from your node"
                    : isDirect
                    ? "📍 Direct distress from another node"
                    : "🔁 Relayed through your network"}
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
