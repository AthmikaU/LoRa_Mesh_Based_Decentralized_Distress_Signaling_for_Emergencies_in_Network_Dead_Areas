import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log("DB Connection Error:", error));

// Schema for distress messages
const messageSchema = new mongoose.Schema({
  nodeID: { type: Number, required: true },
  seqNo: { type: Number, required: true },
  message: { type: String, required: true },
  coordinates: { type: String, required: true },
  actionStatus: { 
    type: String, 
    enum: ["Pending", "Working", "Closed"], 
    default: "Pending" 
  },
  timestamp: { type: Date, default: Date.now }, // helpful for date filters
//   timestamp: { type: Date, required: true }
});

const msgModel = mongoose.model("DistressMessage", messageSchema);

// Add a new distress (default = Pending)
const processmessages = async (req, res) => {
  try {
    const { nodeID, seqNo, message, coordinates, timestamp } = req.body;

    const result = await msgModel.create({
      nodeID,
      seqNo,
      message,
      coordinates,
      timestamp: timestamp || Date.now() // use provided one or fallback
    });

    res.status(200).json({ msg: "New distress added to DB", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all messages (sorted by newest first)
const getmessages = async (req, res) => {
  try {
    const messages = await msgModel.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update distress status (admin action)
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

    if (!updated) {
      return res.status(404).json({ error: "Distress not found" });
    }

    res.status(200).json({ msg: "Status updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.post("/senddistress", processmessages);
app.get("/getdistresses", getmessages);
app.put("/updateStatus/:id", updateStatus); 

app.listen(port, () => console.log(`Server running on port ${port}`));
