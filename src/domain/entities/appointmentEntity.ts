import { ObjectId } from "mongoose";

export interface appointment {
  _id: string | ObjectId;
  bookingSlotId: string | ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}

interface UserDataForAppointRequests {
  _id: ObjectId;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  profilePic: string;
}

interface TrainerDataForAppointRequests extends UserDataForAppointRequests {}

interface BookingSlotDataForAppointmentRequests {
  _id: ObjectId;
  createdAt: string;
}

export interface AppointmentRequestsTrainer {
  _id: ObjectId;
  appointmentDate: string;
  appointmentTime: string;
  trainerId:ObjectId
  status:string
  createdAt:string
  userData: UserDataForAppointRequests;
  bookingSlotData: BookingSlotDataForAppointmentRequests;
}

export interface AppointmentRequestsUser {
  _id: ObjectId;
  appointmentDate: string;
  appointmentTime: string;
  trainerId:ObjectId
  status:string
  createdAt:string
  trainerData: TrainerDataForAppointRequests;
  bookingSlotData: BookingSlotDataForAppointmentRequests;
}


