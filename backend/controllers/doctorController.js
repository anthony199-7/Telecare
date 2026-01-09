/** @format */

import doctorModel from "../models/doctorModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({
      success: true,
      message: "Doctor availability updated successfully",
    });
  } catch (error) {
    console.error("Error changing availability:", error);
    res.json({ message: "Internal server error" });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    res.json({ message: "Internal server error" });
  }
};


// API to get a single doctor's details by ID
const getDoctorById = async (req, res) => {
    try {
        const { docId } = req.params;

        // Fetch the doctor data, excluding the password field for security
        const doctor = await doctorModel.findById(docId).select('-password');

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        res.json({ success: true, doctor });

    } catch (error) {
        console.error("Error fetching doctor:", error);
        res.json({ success: false, message: error.message });
    }
};

export { changeAvailability, doctorList , getDoctorById};
