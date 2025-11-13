import React from "react";
import { openGoogleMaps } from "./MapUtils";

const DistressModal = ({ distress, onClose }) => {
  const coords = distress.coordinates?.split("/") || [];
  const isRelayed = coords.length > 1;

  const handleMapOpen = () => openGoogleMaps(coords);

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
    <div className="modal-overlay">
      <div className="modal-content" data-status={distress.actionStatus}>
        <h2>Distress Details</h2>

        <p><b>Node ID:</b> {distress.nodeID}</p>
        <p><b>Sequence No:</b> {distress.seqNo}</p>
        <p><b>Message:</b> {distress.message}</p>
        <p><b>Signal Type:</b> {isRelayed ? "Relayed" : "Direct"}</p>

        {isRelayed ? (
          <div className="coords-section">
            <p className="path-title">Signal Path:</p>
            {(distress.relayedNodes?.length
              ? distress.relayedNodes
              : coords.map((loc, i) => ({
                  nodeID: i + 1,
                  coordinates: loc,
                }))
            ).map((node, i) => (
              <div className="coord-line" key={i}>
                <span className="node-id">Node {node.nodeID}:</span>{" "}
                <a
                  href={`https://www.google.com/maps?q=${node.coordinates}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {node.coordinates}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>
            <b>Location:</b>{" "}
            <a
              href={`https://www.google.com/maps?q=${coords[0]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {coords[0]}
            </a>
          </p>
        )}

        <p><b>Status:</b> {distress.actionStatus || "Pending"}</p>

        {distress.timestamp && (
          <p><b>Timestamp:</b> {formatTimestamp(distress.timestamp)}</p>
        )}

        <div className="modal-buttons">
          <button className="map-btn" onClick={handleMapOpen}>
            📍 View on Google Maps
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistressModal;
