import cors from "cors";
import express from "express";
import { apiRoutes } from "./routes/api";

export const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Routes
app.use("/api", apiRoutes);
