import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IAppointment extends Document {
  _id: ObjectId;
  bookingSlotId: ObjectId;
  userId: ObjectId;
  trainerId: ObjectId;
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
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid user id");
        }
      },
    },
    bookingSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "BookingSlot",
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid booking id");
        }
      },
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Trainer",
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid trainer id");
        }
      },
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/.test(v),
        message: "Appointment time must be in 'hh:mm AM/PM' format",
      },
    },
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
