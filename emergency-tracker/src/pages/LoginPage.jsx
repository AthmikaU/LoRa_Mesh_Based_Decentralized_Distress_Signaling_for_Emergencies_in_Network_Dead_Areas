import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = ({ setToken, setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nodeID, setNodeID] = useState("");
  const [role, setLoginRole] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Clear any previous session
    localStorage.clear();

    const hardcodedAdmin = { username: "admin", password: "admin123" };

    if (role === "admin") {
      // Admin login
      if (username === hardcodedAdmin.username && password === hardcodedAdmin.password) {
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("role", "admin");
        setToken("admin-token");
        setRole("admin");
        navigate("/dashboard");
      } else {
        setError("❌ Invalid admin credentials");
      }
    } else if (role === "user") {
      // Node user login
      const nodeNum = parseInt(nodeID.trim(), 10);
      const minNode = 1;
      const maxNode = 50;

      if (isNaN(nodeNum)) {
        setError("⚠️ Node/User ID must be a number");
      } else if (nodeNum < minNode || nodeNum > maxNode) {
        setError(`⚠️ Node/User ID must be between ${minNode} and ${maxNode}`);
      } else {
        const token = `node-${nodeNum}`;
        localStorage.setItem("token", token);
        localStorage.setItem("role", "user");
        localStorage.setItem("nodeID", nodeNum);
        setToken(token);
        setRole("user");
        navigate(`/userdashboard/${nodeNum}`);
      }
    } else {
      setError("⚠️ Please select a valid role");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Emergency Alert Tracker</h2>
        <p className="subtitle">Login Portal</p>

        <form onSubmit={handleLogin}>
          {/* Role Selection */}
          <div className="input-group">
            <label>Select Role</label>
            <select value={role} onChange={(e) => setLoginRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Admin Fields */}
          {role === "admin" ? (
            <>
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Admin Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            // User Field
            <div className="input-group">
              <span className="input-icon">📡</span>
              <input
                type="text"
                placeholder="Enter Node/User ID (1-50)"
                value={nodeID}
                onChange={(e) => setNodeID(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
