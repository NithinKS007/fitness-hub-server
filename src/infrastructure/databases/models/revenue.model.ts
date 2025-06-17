import { IRevenue } from "@domain/entities/revenue.entity";
import mongoose, { Schema } from "mongoose";

const revenueSchema: Schema = new Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
    userSubscriptionPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSubscriptionPlan",
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
      ref: "Trainer",
      required: true,
      set: (value: string) => {
        return typeof value === "string" &&
          mongoose.Types.ObjectId.isValid(value)
          ? new mongoose.Types.ObjectId(value)
          : value;
      },
    },
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
    amountPaid: { type: Number, required: true },
    platformRevenue: { type: Number, required: true },
    trainerRevenue: { type: Number, required: true },
    commission: { type: Number, required: true },
  },
  { timestamps: true }
);

const RevenueModel = mongoose.model<IRevenue>("Revenue", revenueSchema);

export default RevenueModel;
