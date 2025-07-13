// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import chartRoutes from "./routes/chartRoutes";
import { swaggerSpec } from "./config/swagger";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Redirect root to Swagger UI
app.get("/", (_req, res) => {
  res.redirect("/api-docs");
});

app.use("/api/auth", authRoutes);
app.use("/api/charts", chartRoutes);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "MermaidGenie API Docs",
  }),
);

export default app;
