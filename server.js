// ══════════════════════════════════════════════
//  ApnaStore — server.js  (Entry Point)
// ══════════════════════════════════════════════
require("dotenv").config();
require("express-async-errors");

const express     = require("express");
const mongoose    = require("mongoose");
const cors        = require("cors");
const helmet      = require("helmet");
const morgan      = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit   = require("express-rate-limit");
const path        = require("path");

const { connectDB }        = require("./config/db");
const { errorHandler }     = require("./middleware/errorHandler");
const { notFound }         = require("./middleware/notFound");
const logger               = require("./config/logger");

// ── Routes ──────────────────────────────────
const authRoutes     = require("./routes/auth.routes");
const userRoutes     = require("./routes/user.routes");
const productRoutes  = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes    = require("./routes/order.routes");
const cartRoutes     = require("./routes/cart.routes");
const reviewRoutes   = require("./routes/review.routes");
const paymentRoutes  = require("./routes/payment.routes");
const uploadRoutes   = require("./routes/upload.routes");
const adminRoutes    = require("./routes/admin.routes");
const wishlistRoutes = require("./routes/wishlist.routes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ──────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(mongoSanitize());

// ── CORS ─────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// ── Rate Limiting ─────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message:  { success: false, message: "Too many requests. Please try again later." }
});
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10,
  message: { success: false, message: "Too many auth attempts. Try again in 15 minutes." }
});
app.use("/api", limiter);
app.use("/api/auth", authLimiter);

// ── Body Parsers ──────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ── Logging ───────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: { write: msg => logger.info(msg.trim()) } }));
}

// ── Static Files ──────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health Check ──────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "ApnaStore API is running 🚀",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// ── API Routes ────────────────────────────────
app.use("/api/v1/auth",      authRoutes);
app.use("/api/v1/users",     userRoutes);
app.use("/api/v1/products",  productRoutes);
app.use("/api/v1/categories",categoryRoutes);
app.use("/api/v1/orders",    orderRoutes);
app.use("/api/v1/cart",      cartRoutes);
app.use("/api/v1/reviews",   reviewRoutes);
app.use("/api/v1/payments",  paymentRoutes);
app.use("/api/v1/uploads",   uploadRoutes);
app.use("/api/v1/admin",     adminRoutes);
app.use("/api/v1/wishlist",  wishlistRoutes);

// ── Error Handlers ────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`✅  ApnaStore server running on http://localhost:${PORT}`);
      logger.info(`📦  Environment: ${process.env.NODE_ENV}`);
      logger.info(`🗄️   MongoDB: connected`);
    });
  } catch (err) {
    logger.error("❌  Failed to start server:", err.message);
    process.exit(1);
  }
};

start();

module.exports = app;
