import { Action } from "./utility-dtos";

export interface CreateBookingSlotDTO {
  trainerId: string;
  time: string;
  date: Date;
}

export interface BookAppointmentDTO {
  slotId: string;
  userId: string;
}

export interface HandleBookingDTO {
  appointmentId: string;
  bookingSlotId: string;
  action: Action;
}

export enum BookingStatus {
  Completed = "completed",
  Pending = "pending",
}

export const enum BookingSlotStatus {
  PENDING = "pending",
  BOOKED = "booked",
  COMPLETED = "completed",
}
