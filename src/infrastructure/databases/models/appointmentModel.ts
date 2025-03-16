import mongoose, { Schema, Document } from "mongoose";

interface IAppointment extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  bookingSlotId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  trainerId: mongoose.Schema.Types.ObjectId; 
  appointmentDate: Date; 
  appointmentTime: string; 
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

const appointmentSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, 
    bookingSlotId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BookingSlot' },
    trainerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Trainer' },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  },
  { timestamps: true } 
);

const appointmentModel = mongoose.model<IAppointment>("Appointment", appointmentSchema);

export default appointmentModel;
