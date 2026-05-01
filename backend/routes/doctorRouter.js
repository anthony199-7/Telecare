import express from "express";
import { doctorList, getDoctorById } from "../controllers/doctorController.js";

const doctorRouter = express.Router();
doctorRouter.get("/list", doctorList);
doctorRouter.get('/:docId', getDoctorById)
export default doctorRouter;