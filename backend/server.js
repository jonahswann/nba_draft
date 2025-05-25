import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'scouting_reports.json');

app.use(cors());
app.use(express.json());

// 🟢 GET: Read report
app.get('/reports/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  res.json(data[playerId] || '');
});

// 🟡 PUT: Save report — PLACE THIS EXACTLY HERE
app.put('/reports/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const reportText = req.body.report;

  console.log(`[PUT] Saving report for playerId: ${playerId}`);
  console.log(`Content: ${reportText}`);

  if (!playerId || typeof reportText !== 'string') {
    console.error("❌ Invalid playerId or report text.");
    return res.status(400).json({ success: false, message: "Invalid input." });
  }

  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(DATA_FILE));
    } catch (err) {
      console.error("❌ Failed to parse scouting_reports.json", err);
    }
  }

  data[playerId] = reportText;

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Saved successfully to ${DATA_FILE}`);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to write to file:", err);
    res.status(500).json({ success: false, message: "Failed to save report." });
  }
});

// 🟣 Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
