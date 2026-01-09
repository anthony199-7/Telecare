/** @format */

// models/Doctor.js
// you should use: import mongoose from 'mongoose';
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    // Basic User/Profile Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Enforce unique emails
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true, // This will store the Cloudinary URL
    },

    // Professional Information
    speciality: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    experience: {
      type: Number, // You might consider Number type for easier querying
      required: true,
    },
    about: {
      type: String,
      required: true,
    },

    // Availability and Fees
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
    fees: {
      type: Number, // Changed from String for mathematical operations
      required: true,
    },
    address: {
      type: Object, // Stores structured address data (e.g., city, state, clinic name)
      required: true,
    },

    // Booking/Scheduling Information
    // Note: The 'date' field in the image is ambiguous; it's better to use timestamps
    // or a specific appointment date model. We will rely on built-in timestamps below.

    date: { type: Number, required: true }, // This could represent the date of the next available appointment

    slots_booked: {
      type: Object, // Could be a map of dates to array of booked slots
      default: {},
    },
  },
  {
    // Schema Options
    timestamps: true, // Automatically manages createdAt and updatedAt fields
    minimize: false, // Keeps fields set to 'undefined' in the schema definition
  }
);

// The model creation syntax needs to be consistent:
// Mongoose checks if a model with the name 'Doctor' already exists; if so, it returns it.
const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
