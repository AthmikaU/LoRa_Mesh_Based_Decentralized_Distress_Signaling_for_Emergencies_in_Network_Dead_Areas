import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import DistressCard from "./DistressCard";
import DistressModal from "./DistressModal";
import "../App.css";

const Dashboard = ({ setToken }) => {
  const [distressList, setDistressList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedDistress, setSelectedDistress] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  // Fetch from backend
  const fetchDistress = async () => {
    try {
      const res = await api.get("/getdistresses");
      // Sort newest first by timestamp
      const sorted = res.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setDistressList(sorted);
    } catch (err) {
      console.error("Error fetching distress data:", err);
    }
  };

  useEffect(() => {
    fetchDistress();
    const interval = setInterval(fetchDistress, 8000); // refresh every 8s
    return () => clearInterval(interval);
  }, []);

  // Filtering Logic
  useEffect(() => {
    let filtered = distressList;

    // Time-based filter
    if (timeFilter !== "all") {
      const now = new Date();
      const timeLimits = {
        week: 7,
        month: 30,
        threeMonths: 90,
        year: 365,
      };
      const days = timeLimits[timeFilter];
      filtered = filtered.filter((item) => {
        const created = new Date(item.timestamp || item.createdAt);
        const diff = (now - created) / (1000 * 60 * 60 * 24);
        return diff <= days;
      });
    }

    // Status-based filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.actionStatus?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Always keep newest on top
    filtered.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setFilteredList(filtered);
  }, [timeFilter, statusFilter, distressList]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Emergency Alert Tracker Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Filters */}
      <div className="filters">
        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
          <option value="all">All Time</option>
          <option value="week">Last 1 Week</option>
          <option value="month">Last 1 Month</option>
          <option value="threeMonths">Last 3 Months</option>
          <option value="year">Last 1 Year</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="working">Working</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Cards */}
      <div className="distress-cards-container">
        {filteredList.map((distress) => (
          <DistressCard
            key={distress._id}
            distress={distress}
            onClick={() => setSelectedDistress(distress)}
            onStatusChange={fetchDistress}
          />
        ))}
      </div>

      {selectedDistress && (
        <DistressModal
          distress={selectedDistress}
          onClose={() => setSelectedDistress(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
