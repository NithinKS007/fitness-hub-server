import { Document, ObjectId } from "mongoose";

export interface IBookingSlot extends Document {
  _id: ObjectId;
  trainerId: string | ObjectId;
  status: "pending" | "booked" | "completed";
  time: string;
  date: Date;
}
