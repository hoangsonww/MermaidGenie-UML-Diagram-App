import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import chartRoutes from "./routes/chartRoutes";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Expose generated OpenAPI spec as JSON
app.get("/swagger.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Serve a minimal HTML page that pulls Swagger‑UI (CSS, JS, favicon) from the CDN
app.get("/api-docs", (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MermaidGenie API Docs</title>
  <link rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css" />
  <!-- Favicon from Swagger‑UI CDN -->
  <link rel="icon"
        type="image/png"
        sizes="32x32"
        href="https://unpkg.com/swagger-ui-dist@4/favicon-32x32.png" />
  <link rel="icon"
        type="image/png"
        sizes="16x16"
        href="https://unpkg.com/swagger-ui-dist@4/favicon-16x16.png" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: '/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: 'BaseLayout',
        docExpansion: 'none',
        deepLinking: true
      });
    };
  </script>
</body>
</html>`);
});

// Redirect “/” to our docs
app.get("/", (_req, res) => {
  res.redirect("/api-docs");
});

// Mount real API routes
app.use("/api/auth", authRoutes);
app.use("/api/charts", chartRoutes);

export default app;
