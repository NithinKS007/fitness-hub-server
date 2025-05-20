import mongoose, { Schema, Document } from "mongoose";

interface IBookingSlot extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  trainerId: mongoose.Schema.Types.ObjectId 
  status: 'pending' | 'booked' | 'completed'
  time: string;
  date: Date;
}

const bookingSlotSchema: Schema = new Schema(
  {
    trainerId: { type: mongoose.Schema.Types.ObjectId,  ref: "Trainer", required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['pending', 'booked', 'completed'], default: 'pending' },
    date: { type :Date,required:true}
  },
  { timestamps: true }
);

bookingSlotSchema.index({ trainerId: 1, date: 1, status: 1 });
bookingSlotSchema.index(
  { date: 1, status: 1 },
  { partialFilterExpression: { status: "pending" } }
);
const bookingSlotModel = mongoose.model<IBookingSlot>("BookingSlot",bookingSlotSchema);

export default bookingSlotModel;
