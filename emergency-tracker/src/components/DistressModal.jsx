import React from "react";
import { openGoogleMaps } from "./MapUtils";

const DistressModal = ({ distress, onClose }) => {
  const coords = distress.coordinates.split("/");
  const isRelayed = coords.length > 1;

  const handleMapOpen = () => {
    openGoogleMaps(coords);
  };

  return (
    <div className="modal-overlay">
      {/* 🔹 Add a data-status attribute to color modal border based on status */}
      <div className="modal-content" data-status={distress.actionStatus}>
        <h2>Distress Details</h2>

        <p><b>Node ID:</b> {distress.nodeID}</p>
        <p><b>Sequence No:</b> {distress.seqNo}</p>
        <p><b>Message:</b> {distress.message}</p>
        <p><b>Signal Type:</b> {isRelayed ? "Relayed" : "Direct"}</p>

        {isRelayed ? (
          <div>
            <b>Locations:</b>
            {coords.map((loc, i) => (
              <p key={i}>Location {i + 1}: {loc}</p>
            ))}
          </div>
        ) : (
          <p><b>Location:</b> {coords[0]}</p>
        )}

        <p><b>Status:</b> {distress.actionStatus || "Pending"}</p>

        {distress.timestamp && (
          <p>
            <b>Timestamp:</b> {new Date(distress.timestamp).toLocaleString()}
          </p>
        )}

        <div style={{ marginTop: "15px" }}>
          <button onClick={handleMapOpen}>📍 View on Google Maps</button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistressModal;
