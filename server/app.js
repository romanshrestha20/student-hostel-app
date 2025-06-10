// /server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma/client.js"; // Import Prisma client
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import hostelRoutes from "./routes/hostelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/favorites", favoriteRoutes);

// Test Prisma DB route
app.get("/test-db", async (req, res) => {
  try {
    const now = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ success: true, time: now[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

// check if db connection is successful
prisma.$connect()
    .then(() => {  
        console.log("✅ Connected to the database successfully");
    })
    .catch((error) => {
        console.error("❌ Failed to connect to the database:", error);
        process.exit(1); // Exit the process if DB connection fails
    }
);

export default app;
