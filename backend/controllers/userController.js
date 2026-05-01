/** @format */

// api for login , register , logout , get user info, update profile gate profile book appointment cancel appointment payment gateway
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
// to register a user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check if user already exists
    if (!name || !password || !email) {
      return res.json({ success: false, message: "All fields are required" });
    }
    // validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }
    // check password strength
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save user to database
    const userData = { name, email, password: hashedPassword };

    const newUser = new UserModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// login user

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");

    console.log("Fetched user:", user);
    if (!user || !user.password) {
      return res.json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("--- DEBUGGING BCRYPT ---");
    console.log("Input Password:", password); // This comes from req.body
    console.log(
      "Hashed Password from DB:",
      user ? user.password : "USER IS NULL"
    );
    console.log("Type of Input:", typeof password);
    console.log("Type of Hash:", typeof user?.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // extracted from token middleware
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID missing from request" });
    }
    const userData = await UserModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to update user profile



const updateProfile = async (req, res) => {
    try {
        const userId = req.userId; // ID attached by authUser middleware
        
        // 1. Extract and PARSE the address field
        const { name, email, phone, gender, dob, address, oldImagePublicId } = req.body;
        
        // Convert the stringified address back into an object
        const parsedAddress = JSON.parse(address); 

        // 2. Prepare update data
        const updateData = {
            name, email, phone, gender, dob, address: parsedAddress
        };
        
        // 3. Handle Image Upload/Deletion
        if (req.file) { // <-- CRUCIAL: Only run if a file was successfully processed by Multer
            
            // Delete old image from Cloudinary (if public ID exists)
            if (oldImagePublicId) {
                await cloudinary.v2.uploader.destroy(oldImagePublicId);
            }
            
            // Upload new image using the path provided by Multer
            const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "telecare_profiles",
            });
            
            // Update data with the new image URL and Public ID
            updateData.image = uploadResult.secure_url;
            updateData.imagePublicId = uploadResult.public_id;

            // Delete the temporary file created by Multer
            fs.unlinkSync(req.file.path); 
        }

        // 4. Find and Update the user
        const updatedUser = await userModel.findByIdAndUpdate(
            userId, 
            { $set: updateData }, 
            { new: true, runValidators: true } // new: true returns the updated document
        ).select('-password'); 

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({ 
            success: true, 
            message: "Profile updated successfully.", 
            userData: updatedUser 
        });

    } catch (error) {
        // Log the actual error to your terminal for debugging (the validation error was caught here)
        console.error("Error updating profile:", error); 
        res.status(500).json({ success: false, message: "Server error during profile update." });
    }
};

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select("-password");

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available" });
        }

        let slots_booked = docData.slots_booked;

        // Checking for availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" });
            }
        } else {
            slots_booked[slotDate] = [];
        }

        slots_booked[slotDate].push(slotTime);

        const userData = await UserModel.findById(userId).select("-password");
        delete docData.slots_booked; // Don't save slots history in the appointment doc

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Save new slots data to doctor
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Booked" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment };
