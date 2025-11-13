import React, { useState } from "react";
import { api } from "../api";

const DistressCard = ({ distress, onClick, onStatusChange }) => {
  const coords = distress.coordinates?.split("/") || [];
  const isRelayed = coords.length > 1;
  const lastLocation = coords[coords.length - 1];
  const [status, setStatus] = useState(distress.actionStatus || "Pending");

  const handleStatusUpdate = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await api.put(`/updateStatus/${distress._id}`, {
        actionStatus: newStatus,
      });
      onStatusChange();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="distress-card"
      data-status={status}
      onClick={onClick}
      title="Click to view details"
    >
      <h3>Node {distress.nodeID}</h3>
      <p><b>Type:</b> {isRelayed ? "Relayed" : "Direct"}</p>
      <p><b>Message:</b> {distress.message}</p>
      <p><b>Last Seen:</b> {lastLocation}</p>
      <p>
        <b>Status:</b>{" "}
        <select
          value={status}
          onChange={handleStatusUpdate}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="Pending">Pending</option>
          <option value="Working">Working</option>
          <option value="Closed">Closed</option>
        </select>
      </p>
      {distress.timestamp && (
        <small className="timestamp">🕒 {formatTimestamp(distress.timestamp)}</small>
      )}
    </div>
  );
};

export default DistressCard;
