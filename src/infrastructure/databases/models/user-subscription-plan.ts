import { IUserSubscriptionPlan } from "@domain/entities/subscription-plan.entity";
import mongoose, { Schema } from "mongoose";

const userSubscriptionPlanSchema: Schema = new Schema(
  {
    userId: {
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
    stripePriceId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true },
    stripeSubscriptionStatus: { type: String, required: true },
  },
  { timestamps: true }
);

userSubscriptionPlanSchema.index({
  userId: 1,
  stripeSubscriptionStatus: 1,
  createdAt: -1,
});
userSubscriptionPlanSchema.index({
  trainerId: 1,
  stripeSubscriptionStatus: 1,
  createdAt: -1,
});
userSubscriptionPlanSchema.index({ stripeSubscriptionId: 1 }, { unique: true });

const UserSubscriptionPlanModel = mongoose.model<IUserSubscriptionPlan>(
  "UserSubscriptionPlan",
  userSubscriptionPlanSchema
);

export default UserSubscriptionPlanModel;
