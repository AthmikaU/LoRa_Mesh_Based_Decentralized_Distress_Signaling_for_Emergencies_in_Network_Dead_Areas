import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

// === MongoDB Connection ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log("DB Connection Error:", error));

// === Schema ===
const messageSchema = new mongoose.Schema({
  nodeID: { type: Number, required: true },
  seqNo: { type: Number, required: true },
  message: { type: String, required: true },
  coordinates: { type: String, required: true },
  relayedNodes: [
    {
      nodeID: { type: Number },
      coordinates: { type: String }
    }
  ],
  actionStatus: {
    type: String,
    enum: ["Pending", "Working", "Closed"],
    default: "Pending"
  },
  timestamp: { type: Date, default: Date.now }
});

const msgModel = mongoose.model("DistressMessage", messageSchema);

// === POST: Add new distress message ===
const processMessages = async (req, res) => {
  try {
    const { nodeID, seqNo, message, coordinates, relayedNodes, timestamp, actionStatus } = req.body;

    // Required fields check
    if (!nodeID || !seqNo || !message || !coordinates) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payload = {
      nodeID,
      seqNo,
      message,
      coordinates,
      // Explicitly default to "Pending" if not provided
      actionStatus: actionStatus || "Pending",
      timestamp: timestamp ? new Date(timestamp) : Date.now(),
    };

    if (Array.isArray(relayedNodes) && relayedNodes.length > 0) {
      payload.relayedNodes = relayedNodes;
    }

    const result = await msgModel.create(payload);

    res.status(201).json({
      msg: "Distress signal stored successfully",
      type: relayedNodes?.length ? "Relayed" : "Direct",
      result
    });
  } catch (err) {
    console.error("Error storing distress:", err);
    res.status(500).json({ error: err.message });
  }
};

// === GET: Fetch all messages ===
const getMessages = async (req, res) => {
  try {
    const messages = await msgModel.find().sort({ timestamp: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// === PUT: Update distress status ===
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionStatus } = req.body;

    if (!["Pending", "Working", "Closed"].includes(actionStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await msgModel.findByIdAndUpdate(
      id,
      { actionStatus },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Distress not found" });

    res.status(200).json({ msg: "Status updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// === Routes ===
app.post("/senddistress", processMessages);
app.get("/getdistresses", getMessages);
app.put("/updateStatus/:id", updateStatus);

app.listen(port, () => console.log(`Server running on port ${port}`));
