import mongoose, { Document } from "mongoose";

export interface IBookingSlot extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  trainerId: string | mongoose.Schema.Types.ObjectId;
  status: "pending" | "booked" | "completed";
  time: string;
  date: Date;
}
