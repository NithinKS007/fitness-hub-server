import mongoose, { Document } from "mongoose";

export interface IAppointment extends Document {
  _id:mongoose.Schema.Types.ObjectId;
  bookingSlotId: string | mongoose.Schema.Types.ObjectId;
  userId: string | mongoose.Schema.Types.ObjectId;
  trainerId: string | mongoose.Schema.Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}
