import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IBookingSlot extends Document {
  _id: ObjectId;
  trainerId: string | ObjectId;
  status: "pending" | "booked" | "completed";
  time: string;
  date: Date;
}

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
          : (() => {
              throw new Error("Please provide a valid trainer id");
            })();
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
