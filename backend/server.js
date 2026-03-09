const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/passwords", passwordRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Password Generator Backend Running");
});

// DB test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
