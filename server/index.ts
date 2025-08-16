import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { handleDemo } from "./routes/demo";
import { login, register, validateToken } from "./routes/auth";
import { authenticateToken, requireSubscriber } from "./middleware/auth";
import {
  getSubscriptionPlans,
  createSubscription,
  cancelSubscription,
  getSubscriptionStatus,
  handleMercadoPagoWebhook,
} from "./routes/subscription";
import {
  uploadContent,
  getCreatorContent,
  updateContentStatus,
  getPendingContent,
  recordView,
} from "./routes/content";
import { initializeAdmin, initializeSampleData } from "./scripts/initAdmin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to MongoDB
  const connectDB = async () => {
    try {
      const mongoUri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/xnema";
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB");

      // Initialize admin user and sample data
      await initializeAdmin();
      await initializeSampleData();
    } catch (error) {
      console.error("MongoDB connection error:", error);
      console.log("Continuing without database...");
    }
  };

  // Initialize database connection
  connectDB();

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.get("/api/auth/validate", authenticateToken, validateToken);

  // Subscription routes
  app.get("/api/subscription/plans", getSubscriptionPlans);
  app.post(
    "/api/subscription/subscribe",
    authenticateToken,
    requireSubscriber,
    createSubscription,
  );
  app.post(
    "/api/subscription/cancel",
    authenticateToken,
    requireSubscriber,
    cancelSubscription,
  );
  app.get("/api/subscription/status", authenticateToken, getSubscriptionStatus);
  app.post("/api/webhook/mercadopago", handleMercadoPagoWebhook);

  // Content management routes
  app.post("/api/content/upload", authenticateToken, uploadContent);
  app.get("/api/content/creator", authenticateToken, getCreatorContent);
  app.put(
    "/api/content/:contentId/status",
    authenticateToken,
    updateContentStatus,
  );
  app.get("/api/content/pending", authenticateToken, getPendingContent);
  app.post("/api/content/:contentId/view", recordView);

  // Protected routes (examples)
  app.get("/api/admin/users", authenticateToken, async (req, res) => {
    try {
      // Only admins can access this
      if (req.userRole !== "admin") {
        return res.status(403).json({ message: "Acesso negado" });
      }

      const User = require("./models/User").default;
      const users = await User.find({}).select("-password");
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  app.get("/api/creator/analytics", authenticateToken, async (req, res) => {
    try {
      if (req.userRole !== "creator") {
        return res.status(403).json({ message: "Acesso negado" });
      }

      // Mock analytics data
      const analytics = {
        totalViews: req.user.content?.totalViews || 0,
        totalEarnings: req.user.content?.totalEarnings || 0,
        monthlyViews: 450,
        monthlyEarnings: req.user.content?.monthlyEarnings || 0,
        topVideos: [
          { id: "1", title: "Vídeo Popular 1", views: 500, earnings: 25.5 },
          { id: "2", title: "Vídeo Popular 2", views: 300, earnings: 15.75 },
        ],
        viewsHistory: [
          { date: "2024-01-01", views: 100 },
          { date: "2024-01-02", views: 150 },
          { date: "2024-01-03", views: 200 },
        ],
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar analytics" });
    }
  });

  return app;
}
