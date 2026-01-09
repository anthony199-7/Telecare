/** @format */

import express from "express";
import cors from "cors";
import "dotenv/config";
import ConnectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorModel from "./models/doctorModel.js";

import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRouter.js";

// add config
const app = express();
const port = process.env.port || 4000;
ConnectDB();
connectCloudinary();

//middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// api endpoint
app.use("/api/admin", adminRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/users", userRouter);
app.get("/", (req, res) => {
  res.send("API WORKING well");
});

app.get("/api/admin/doctors", async (req, res) => {
  try {
    const docs = await doctorModel.find().select("-password").limit(50).lean();
    res.json({ success: true, count: docs.length, doctors: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// START server

app.listen(port, () => console.log("server started", port));
