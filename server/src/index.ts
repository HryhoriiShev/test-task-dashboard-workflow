import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { apiLimiter } from "./middlewares/rate-limit";
import businessRoutes from "./routes/business.routes";
import reportRoutes from "./routes/report.routes";

const app = express();
const PORT = env.PORT;

// Security middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
app.use("/api", apiLimiter);

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      environment: env.NODE_ENV,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
    });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "OvaSight API is running 🚀" });
});

// API routes
app.use("/api/businesses", businessRoutes);
app.use("/api/reports", reportRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (
    err.message === "Invalid file type. Only images and videos are allowed."
  ) {
    res.status(400).json({ error: err.message });
    return; // Ensure to return here
  }
  res.status(500).json({ error: "Internal Server Error" });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Received shutdown signal, closing server gracefully...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});
