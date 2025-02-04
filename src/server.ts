import express from "express";
import authRoutes from "./interfaces/routes/authRoutes";

const app = express();




app.use(express.json());
app.use("/api/v1/auth",authRoutes)

export default app;
