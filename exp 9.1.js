// server.js
const express = require("express");
const app = express();

// Logging Middleware (global)
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

// Bearer Token Authentication Middleware (for protected routes)
function tokenAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== "mysecrettoken") {
    return res.status(403).json({ error: "Invalid token" });
  }
  next();
}

// Public route - accessible to everyone
app.get("/public", (req, res) => {
  res.send("This is a public route - no authentication needed.");
});

// Protected route - requires Bearer token
app.get("/protected", tokenAuth, (req, res) => {
  res.send("Welcome to the protected route! You provided the correct Bearer token.");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
