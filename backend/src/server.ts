import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import imageRoutes from "./routes/imageRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import initRoutes from "./routes/initRoutes";
import { initDatabase } from "./config/db";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT as string, 10) : 5000;

// Enable CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.CORS_ORIGIN || "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static cake images from both root public/images and backend public/images
const rootImagesDir = path.join(process.cwd(), "..", "public", "images");
const localImagesDir = path.join(process.cwd(), "public", "images");

app.use("/images", express.static(rootImagesDir));
app.use("/images", express.static(localImagesDir));

// Health / Root check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Kerith Cakes Node.js Express API is running.",
    endpoints: [
      "/api/products",
      "/api/users",
      "/api/users/login",
      "/api/upload",
      "/api/images",
      "/api/analytics/realtime",
      "/api/init-db",
    ],
  });
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/init-db", initRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Start server
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`🚀 Kerith Cakes Node.js Backend listening on port ${PORT}`);
  try {
    await initDatabase();
    console.log("✅ MySQL Database connected & ready.");
  } catch (err) {
    console.warn("⚠️ MySQL Database connection warning on startup:", err);
  }
});
