import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(cors());
app.get("/health", (req, res) => {
  res.send("Hello World!");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server is running on port 5000"));
