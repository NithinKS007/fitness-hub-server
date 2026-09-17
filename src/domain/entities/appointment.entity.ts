export interface Appointment {
  id: string;
  bookingSlotId: string;
  userId: string;
  trainerId: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
