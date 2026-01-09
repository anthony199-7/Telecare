/** @format */

import express from "express";
import {
  addDoctor,
  AllDoctors,
  loginAdmin,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import { changeAvailability } from "../controllers/doctorController.js";
import authAdmin from "../middlewares/authAdmin.js";
const adminRouter = express.Router();

adminRouter.post("/add-doctor", upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/all-doctors", AllDoctors);
adminRouter.post("/change-Availability", authAdmin, changeAvailability);

export default adminRouter;
