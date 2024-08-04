import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import connectDB from "./db/dataBaseConnection.js";
import morgan from "morgan";
const app = express();
app.use(morgan("dev"));

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.frontend_url],
    credentials: true,
  })
);
app.get("/health", (req, res) => {
  res.send("Hello World!");
});
//import routes
import userRoute from "./routes/user.route.js";
app.use("/api/v1/user", userRoute);
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
