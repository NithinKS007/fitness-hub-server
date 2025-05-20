import { ObjectId } from "mongoose";

export interface CreateBookingSlotDTO {
  trainerId: string;
  time: string;
  date: Date;
}

export interface BookAppointmentDTO {
  slotId: string;
  userId: string;
}

export interface CreateAppointmentDTO {
  bookingSlotId: string | ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
}

export interface HandleBookingRequestDTO {
  appointmentId: string;
  bookingSlotId: string;
  action: "approved" | "rejected";
}
