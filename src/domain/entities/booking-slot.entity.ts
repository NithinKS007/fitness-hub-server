export interface BookingSlot {
  _id:string;
  trainerId: string ;
  status: "pending" | "booked" | "completed";
  time: string;
  date: Date;
}
