import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// PostgreSQL Pool Setup using url
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Set to true in production with proper SSL certs
  },
});

// Test DB connection
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
    console.error("❌ DB Query Error:", {
      query,
      params,
      message: err.message,
    });
    throw err;
  }
};

// Export the pool for use in other modules
export default pool;