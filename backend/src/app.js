import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { errorHandler } from "./middlewares/error.middleware.js";
import { config } from "./config/index.js";

const app = express();

// CORS Configuration - Must be the FIRST middleware
const corsOptions = {
  origin: (origin, callback) => {
    const allowed = config.corsOrigin || ["*"];
    if (!origin || allowed.includes("*") || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Handle preflight for all routes (Express 5 syntax requires regex or named params)
app.options(/.*/, cors(corsOptions));


// Security Middleware - Disabled crossOriginResourcePolicy to prevent interference with CORS
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
// Body Parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Logger
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

// Routes
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);

// Health Check & Base Route
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "TeamPilot API is live" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running smoothly",
  });
});

console.log("CORS Configured with origin:", config.corsOrigin);

// Global Error Handler
app.use(errorHandler);

export { app };