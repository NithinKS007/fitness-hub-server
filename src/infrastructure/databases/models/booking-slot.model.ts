import { IBookingSlot } from "@domain/entities/booking-slot.entity";
import mongoose, { Schema } from "mongoose";

const bookingSlotSchema: Schema = new Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "booked", "completed"],
      default: "pending",
    },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

bookingSlotSchema.index({ trainerId: 1, date: 1, status: 1 });
bookingSlotSchema.index(
  { date: 1, status: 1 },
  { partialFilterExpression: { status: "pending" } }
);
const BookingSlotModel = mongoose.model<IBookingSlot>(
  "BookingSlot",
  bookingSlotSchema
);

export default BookingSlotModel;
