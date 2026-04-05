import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { redis } from "./config/redis";
import { rateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { initSocket } from "./socket/socket.service";
import { swaggerSpec } from "./docs/swagger";

import taskRoutes from "./modules/tasks/task.routes";
import userRoutes from "./modules/users/user.routes";

const app = express();
const httpServer = http.createServer(app);

// Init WebSocket
initSocket(httpServer);

// Connect Redis (non-blocking)
redis.connect().catch(() => {});

// Core middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter); // Rate limiting on ALL routes

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users", userRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// 404
app.use((_req, res) => {
  res.status(404).json({ data: null, meta: null, error: { message: "Route not found" } });
});

// Global error handler (must be last)
app.use(errorHandler);

httpServer.listen(env.port, () => {
  console.log(`🚀 Server running on port ${env.port}`);
  console.log(`📚 Swagger docs: http://localhost:${env.port}/api-docs`);
});

export default app;