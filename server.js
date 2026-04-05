// ================================
// IMPORTS
// ================================
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = 3000;

// ================================
// MIDDLEWARE
// ================================

// Serve your HTML, CSS, JS files statically
// This replaces what npx serve was doing
app.use(express.static("."));

// ================================
// API PROXY ROUTE
// ================================

// When browser calls /api/hero/spider-man
// This server calls SuperHero API and returns the result
// The browser never touches SuperHero API directly
app.get("/api/hero/:name", async (req, res) => {
  const heroName = req.params.name;
  const token = process.env.SUPERHERO_TOKEN;

  try {
    const response = await fetch(
      `https://superheroapi.com/api/${token}/search/${heroName}`,
      {
        headers: {
          Referer: "https://superheroapi.com",
        },
      },
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch hero data" });
  }
});

// ================================
// START SERVER
// ================================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
