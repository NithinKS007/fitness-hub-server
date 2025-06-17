import { ObjectId } from "mongoose";

interface UserDataForAppointRequests {
  _id: ObjectId;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  profilePic: string;
}

interface BookingSlotDataForAppointmentRequests {
  _id: ObjectId;
  createdAt: string;
}

export interface AppointmentRequestsBase {
  _id: ObjectId;
  appointmentDate: string;
  appointmentTime: string;
  trainerId: ObjectId;
  status: string;
  createdAt: string;
  bookingSlotData: BookingSlotDataForAppointmentRequests;
}

export interface AppointmentRequestsTrainer extends AppointmentRequestsBase {
  userData: UserDataForAppointRequests;
}

export interface AppointmentRequestsUser extends AppointmentRequestsBase {
  trainerData: UserDataForAppointRequests;
}
