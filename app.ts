import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import ComplaintRouter from "./features/complaint/complaint.controller";
import UserRouter from "./features/user/user.controller";

dotenv.config();

export const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || process.env.DB_CONNECTION!);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  console.log(`Server is running on port ${PORT}`);
  res.send("Hello World!");
});

app.use("/complaints", ComplaintRouter);
app.use("/users", UserRouter);

import "./features/bot/bot.service";
