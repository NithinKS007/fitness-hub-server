import mongoose, { Schema, Document, ObjectId } from "mongoose";

type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";

export interface ISubscription extends Document {
  _id: ObjectId;
  trainerId: ObjectId;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
  stripePriceId: string;
}

const subscriptionSchema: Schema = new Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid trainer id.");
        }
      },
    },
    subPeriod: {
      type: String,
      enum: ["monthly", "yearly", "quarterly", "halfYearly"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => {
          return value > 0;
        },
        message: "Price must be a positive number",
      },
    },
    durationInWeeks: {
      type: Number,
      required: true,
      min: [1, "Duration must be at least 1 week"],
    },
    sessionsPerWeek: {
      type: Number,
      required: true,
      min: [1, "Sessions per week cannot be less than 1"],
    },
    totalSessions: {
      type: Number,
      required: true,
      min: [1, "Total sessions must be at least 1"],
    },
    isBlocked: { type: Boolean, default: false },
    stripePriceId: { type: String, required: true },
  },
  { timestamps: true }
);

const SubscriptionModel = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

export default SubscriptionModel;
