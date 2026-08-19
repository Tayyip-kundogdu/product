import express from "express";
import cors from "cors";
import path from "path";

import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";
import { env } from "process";

const app = express();

app.use(cors({
  origin: ENV.FRONTEND_URL, // allow requests from the frontend
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
// `credentials: true` allows the frontend to send cookies to the backend so that we can authenticate the user.
app.use(clerkMiddleware()); // auth obj will be attached to the req
app.use(express.json()); // parses JSON request bodies.
app.use(express.urlencoded({ extended: true })); // parses form data (like HTML forms).

app.get("/api/health", (req, res) => {
  res.json({
    message: "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

if (ENV.NODE_ENV === "production") {
  const __dirname = path.resolve();

  // serve static files from frontend/dist
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // handle SPA routing - send all non-API routes to index.html - react app
  app.get("/{*any}", (req, res) => {
  if (req.path === "/api" || req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }

  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));