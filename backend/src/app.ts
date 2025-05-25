import express from "express";
import { apiRoutes } from "./routes/api";

export const app = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

// Routes
app.use("/api", apiRoutes);
