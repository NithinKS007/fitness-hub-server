import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  bookingSlotId: string | mongoose.Schema.Types.ObjectId;
  userId: string | mongoose.Schema.Types.ObjectId;
  trainerId: string | mongoose.Schema.Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}

const appointmentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    bookingSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "BookingSlot",
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Trainer",
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ userId: 1, appointmentDate: 1, status: 1 });
appointmentSchema.index({ trainerId: 1, appointmentDate: 1, status: 1 });

const AppointmentModel = mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema
);

export default AppointmentModel;
