import { ISubscription } from "@domain/entities/subscription.entity";
import mongoose, { Schema } from "mongoose";

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
          : value;
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
