//express app setup

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:3000"];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(express.static("public"))
app.use(cookieParser())

import authRouter from "./routes/auth.routes.js";
import partyRouter from "./routes/party.routes.js";
import entryRouter from "./routes/entry.routes.js";
import reportRouter from "./routes/report.route.js";
import dashboardRouter from "./routes/dashboard.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/parties",partyRouter);
app.use("/api/v1/entries",entryRouter);
app.use("/api/v1/reports",reportRouter);
app.use("/api/v1/dashboard",dashboardRouter);



export { app };   