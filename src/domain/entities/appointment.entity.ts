export interface Appointment {
  _id: string;
  bookingSlotId: string;
  userId: string;
  trainerId: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}
