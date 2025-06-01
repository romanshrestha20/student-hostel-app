// server.js
import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Pool Setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

// Test DB on server start
pool.query("SELECT NOW()")
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => {
    console.error("❌ PostgreSQL connection error:", err);
    process.exit(1);
  });

// Reusable query function
export const queryDB = async (query, params) => {
  try {
    const { rows } = await pool.query(query, params);
    return rows;
  } catch (err) {
    console.error("DB query error:", err);
    throw err;
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Hostel Finder Server is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
