const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const debugRoutes = require("./routes/debugRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const PORT = process.env.PORT ? Number(process.env.PORT) : 4100;
const NODE_ENV = process.env.NODE_ENV || "development";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname)));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "trust-debugger-demo",
    env: NODE_ENV,
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/debug", debugRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Trust Debugger Demo: http://localhost:${PORT}`);
  console.log("Open the URL in your browser — default audit payload is pre-filled.");
});
