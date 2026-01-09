/** @format */

import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

// api for adding doctor

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // checking  data for all doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // vaidating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    // validating password length
    if (!validator.isLength(password, { min: 6 })) {
      return res.json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    //hashing password before saving to database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //uploading image to cloudinary

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address), // Parse the address string to an object
      image: imageUrl,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "Doctor added successfully" });

    /*console.log({ name, email, password, speciality, degree, experience,  about, fees, address }, imageFile);*/
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// In backend/controllers/adminController.js

// API for getting all doctors
const AllDoctors = async (req, res) => {
    try {
        // Fetch all doctors from the doctorModel (assuming you imported it correctly)
        const doctors = await doctorModel.find({}); 

        res.status(200).json({
            success: true,
            message: "All doctors retrieved successfully",
            doctors: doctors,
        });
    } catch (error) {
        console.error("Error fetching all doctors:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching doctors",
        });
    }
};

// ... keep your existing functions (addDoctor, loginAdmin) ...
// ... keep your existing export { addDoctor, AllDoctors, loginAdmin }; ...

// api for adminlogin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// In backend/controllers/adminController.js (at the end of the file)

export { 
    addDoctor, 
    AllDoctors, // <-- MUST be included and spelled/cased exactly like this
    loginAdmin 
};
