export interface BookingSlot {
  id: string;
  trainerId: string;
  status: "pending" | "booked" | "completed";
  time: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
