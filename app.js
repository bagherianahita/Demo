const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const debugRoutes = require("./routes/debugRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const PORT = process.env.PORT ? Number(process.env.PORT) : 4100;
const NODE_ENV = process.env.NODE_ENV || "development";

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "trust-debugger-demo",
    env: NODE_ENV
  });
});

// Debug / audit routes
app.use("/debug", debugRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`trust-debugger-demo is running on http://localhost:${PORT}`);
});