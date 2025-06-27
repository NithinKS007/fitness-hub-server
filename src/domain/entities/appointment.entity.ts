import { Document, ObjectId } from "mongoose";

export interface IAppointment extends Document {
  _id: ObjectId;
  bookingSlotId: string | ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}
