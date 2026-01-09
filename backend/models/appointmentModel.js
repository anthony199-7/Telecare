import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true }, // Snapshot of user details
    docData: { type: Object, required: true },  // Snapshot of doctor details
    amount: { type: Number, required: true },
    date: { type: Number, required: true },     // Creation timestamp
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false }, // Payment gateway status
    isCompleted: { type: Boolean, default: false }
});

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

export default appointmentModel;