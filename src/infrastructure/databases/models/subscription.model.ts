import mongoose, { Schema, Document, ObjectId } from "mongoose";

type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";

export interface ISubscription extends Document {
  _id: ObjectId;
  trainerId: string | ObjectId;
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
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : (() => {
              throw new Error("Please provide a valid trainer id");
            })();
      },
    },
    subPeriod: {
      type: String,
      enum: ["monthly", "yearly", "quarterly", "halfYearly"],
      required: true,
    },
    price: { type: Number, required: true },
    durationInWeeks: { type: Number, required: true },
    sessionsPerWeek: { type: Number, required: true },
    totalSessions: { type: Number, required: true },
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
