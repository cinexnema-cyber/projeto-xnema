import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import { handleDemo } from "./routes/demo";
import { login, register, validateToken } from "./routes/auth";
import { authenticateToken, requireSubscriber } from "./middleware/auth";
import paymentsRouter from "./routes/payments";
import creatorRouter from "./routes/creator";
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

  // Initialize database connection
  const initializeDatabase = async () => {
    try {
      await connectDB();

      // Initialize admin user and sample data after successful connection
      await initializeAdmin();
      await initializeSampleData();
    } catch (error) {
      console.error("❌ Erro na inicialização do banco de dados:", error);
      console.log("🚨 Continuando sem banco de dados...");
    }
  };

  // Connect to database
  initializeDatabase();

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Create test user route
  app.post("/api/admin/create-test-user", async (_req, res) => {
    try {
      const User = require("./models/User").default;

      // Delete existing test user if exists (both admin and subscriber)
      await User.deleteMany({ email: "cinexnema@gmail.com" });

      // Create new test subscriber user
      const testUser = new User({
        email: "cinexnema@gmail.com",
        password: "I30C77T$Ii", // Will be hashed automatically
        name: "CineXnema Test User",
        role: "subscriber",
        assinante: true, // Full access without payment
        subscription: {
          plan: "premium",
          status: "active",
          startDate: new Date(),
          nextBilling: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          paymentMethod: "test_account",
        },
        watchHistory: [],
      });

      const savedUser = await testUser.save();

      console.log("✅ Usuário de teste criado via API:");
      console.log("📧 Email: cinexnema@gmail.com");
      console.log("🔑 Senha: I30C77T$Ii");

      res.json({
        success: true,
        message: "Usuário de teste criado com sucesso",
        user: {
          email: savedUser.email,
          name: savedUser.name,
          role: savedUser.role,
          assinante: savedUser.assinante,
          subscription: savedUser.subscription,
        },
        loginInfo: {
          email: "cinexnema@gmail.com",
          password: "I30C77T$Ii",
          access: "Acesso completo sem pagamento",
        },
      });
    } catch (error) {
      console.error("❌ Erro ao criar usuário de teste:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.get("/api/auth/validate", authenticateToken, validateToken);

  // Endpoints específicos para Builder.io
  app.post("/api/auth/cadastrar", async (req, res) => {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({
          success: false,
          message: "Nome, email e senha são obrigatórios",
        });
      }

      const User = require("./models/User").default;

      // Verificar se usuário já existe
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email já está em uso",
        });
      }

      // Criar novo usuário (antes do pagamento)
      const userData = {
        email: email.toLowerCase(),
        password: senha,
        name: nome,
        role: "subscriber",
        assinante: false, // Sem acesso até pagamento
        subscription: {
          plan: "premium",
          status: "pending",
          startDate: new Date(),
          paymentMethod: "pending",
        },
        watchHistory: [],
      };

      const user = new User(userData);
      const savedUser = await user.save();

      console.log("✅ Usuário cadastrado (aguardando pagamento):", email);

      res.json({
        success: true,
        message:
          "Usuário cadastrado com sucesso! Complete o pagamento para ter acesso.",
        userId: savedUser._id.toString(),
      });
    } catch (error) {
      console.error("❌ Erro no cadastro:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          success: false,
          message: "Email e senha são obrigatórios",
        });
      }

      const User = require("./models/User").default;

      // Buscar usuário
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email ou senha incorretos",
        });
      }

      // Verificar senha
      const isPasswordValid = await user.comparePassword(senha);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Email ou senha incorretos",
        });
      }

      // Gerar token
      const { generateToken } = require("./middleware/auth");
      const token = generateToken(user._id.toString(), user.email, user.role);

      console.log("✅ Login realizado:", email);

      res.json({
        success: true,
        message: "Login realizado com sucesso",
        token: token,
        isAssinante: user.assinante || false,
        userId: user._id.toString(),
        userName: user.name,
      });
    } catch (error) {
      console.error("❌ Erro no login:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  });

  app.post("/api/auth/pagamento", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "userId é obrigatório",
        });
      }

      const User = require("./models/User").default;

      // Buscar e atualizar usuário
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            assinante: true,
            "subscription.status": "active",
            "subscription.startDate": new Date(),
            "subscription.nextBilling": new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ), // 30 dias
            "subscription.paymentMethod": "mercado_pago",
            "subscription.mercadoPagoId": `mp_${Date.now()}`,
          },
        },
        { new: true },
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
      }

      console.log("✅ Pagamento confirmado para:", user.email);

      res.json({
        success: true,
        message: "Pagamento confirmado! Acesso liberado.",
        isAssinante: true,
        subscription: user.subscription,
      });
    } catch (error) {
      console.error("❌ Erro na confirmação de pagamento:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  });

  // Forgot password endpoint
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email é obrigatório",
        });
      }

      const User = require("./models/User").default;

      // Verificar se usuário existe
      const user = await User.findOne({ email: email.toLowerCase() });

      // Por segurança, sempre retornamos sucesso mesmo se o email não existir
      // Em produção, enviaria email real aqui
      console.log(`📧 Solicitação de recuperação de senha para: ${email}`);
      console.log(
        `✅ ${user ? "Usuário encontrado" : "Usuário não encontrado"} - Email de recuperação "enviado"`,
      );

      res.json({
        success: true,
        message:
          "Se o email existir, você receberá instruções para redefinir sua senha.",
      });
    } catch (error) {
      console.error("❌ Erro na recuperação de senha:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  });

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

  // Pre-payment user registration (with limited access)
  app.post("/api/subscription/pre-register", async (req, res) => {
    try {
      const { email, name, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email e senha são obrigatórios",
        });
      }

      const User = require("./models/User").default;

      // Check if user already exists
      let user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        return res.status(409).json({
          success: false,
          message: "Email já está em uso",
        });
      }

      // Create new user with limited access (before payment)
      const userData = {
        email: email.toLowerCase(),
        password: password,
        name: name || email.split("@")[0] || "Usuário XNEMA",
        role: "subscriber",
        assinante: false, // No access until payment
        subscription: {
          plan: "premium",
          status: "pending",
          startDate: new Date(),
          paymentMethod: "pending",
        },
        watchHistory: [],
      };

      user = new User(userData);
      await user.save();

      console.log("✅ Usuário pré-registrado (antes do pagamento):", email);

      res.json({
        success: true,
        message:
          "Usuário registrado! Complete o pagamento para ter acesso total.",
        user: user.toJSON(),
        requiresPayment: true,
      });
    } catch (error) {
      console.error("❌ Erro no pré-registro:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  });

  // Auto-register subscriber on payment confirmation
  app.post("/api/subscription/auto-register", async (req, res) => {
    try {
      const { email, paymentId, plan = "premium" } = req.body;

      if (!email || !paymentId) {
        return res.status(400).json({
          success: false,
          message: "Email e ID de pagamento são obrigatórios",
        });
      }

      const User = require("./models/User").default;

      // Check if user already exists
      let user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        // Update existing user with subscription
        user.role = "subscriber";
        user.assinante = true;
        user.subscription = {
          plan: plan,
          status: "active",
          startDate: new Date(),
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          paymentMethod: "mercado_pago",
          mercadoPagoId: paymentId,
        };
        user.watchHistory = user.watchHistory || [];

        await user.save();

        console.log("✅ Usuário existente atualizado com assinatura:", email);
      } else {
        // Create new subscriber user
        const userData = {
          email: email.toLowerCase(),
          password: `temp_${Date.now()}_${Math.random().toString(36)}`, // Temporary password
          name: email.split("@")[0] || "Usuário XNEMA",
          role: "subscriber",
          assinante: true,
          subscription: {
            plan: plan,
            status: "active",
            startDate: new Date(),
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            paymentMethod: "mercado_pago",
            mercadoPagoId: paymentId,
          },
          watchHistory: [],
        };

        user = new User(userData);
        await user.save();

        console.log("✅ Novo usuário assinante criado automaticamente:", email);
      }

      res.json({
        success: true,
        message: "Usuário registrado/atualizado com sucesso",
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("❌ Erro no registro automático:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  });

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
      const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 });

      // Statistics
      const stats = {
        total: users.length,
        subscribers: users.filter((u) => u.role === "subscriber").length,
        creators: users.filter((u) => u.role === "creator").length,
        admins: users.filter((u) => u.role === "admin").length,
        activeSubscribers: users.filter(
          (u) =>
            u.role === "subscriber" &&
            (u.subscription?.status === "active" || u.assinante === true),
        ).length,
        pendingCreators: users.filter(
          (u) => u.role === "creator" && u.profile?.status === "pending",
        ).length,
        approvedCreators: users.filter(
          (u) => u.role === "creator" && u.profile?.status === "approved",
        ).length,
      };

      console.log("📊 Usuários cadastrados:", stats);

      res.json({
        success: true,
        users,
        stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Erro ao buscar usuários:", error);
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  // Debug route to show database status
  app.get("/api/debug/db-status", async (req, res) => {
    try {
      const User = require("./models/User").default;
      const userCount = await User.countDocuments();
      const recentUsers = await User.find({})
        .select("email role createdAt")
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        success: true,
        database: {
          connected: true,
          host: require("mongoose").connection.host,
          name: require("mongoose").connection.name,
          totalUsers: userCount,
          recentUsers,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Erro no debug:", error);
      const { getMongoDBConnectionInfo } = require("./utils/mongodbCheck");
      res.json({
        success: false,
        database: {
          connected: false,
          error: error.message,
          connectionInfo: getMongoDBConnectionInfo(),
        },
        timestamp: new Date().toISOString(),
      });
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
