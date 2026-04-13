import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware";

// Route Imports
import productRouter from "./modules/products/router";
import categoryRouter from "./modules/categories/router";
import orderRouter from "./modules/orders/router";
import userRouter from "./modules/users/router";
import settingsRouter from "./modules/settings/router";

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/settings", settingsRouter);

// Error Handling
app.use(errorMiddleware);

export default app;
