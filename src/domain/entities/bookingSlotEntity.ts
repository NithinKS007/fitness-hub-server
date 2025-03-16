import { ObjectId } from "mongoose";

export interface bookingSlot {
  _id: ObjectId | string;
  trainerId: ObjectId | string;
  time:string
  status:'pending' | 'booked' | 'completed'
  date: Date;
}
