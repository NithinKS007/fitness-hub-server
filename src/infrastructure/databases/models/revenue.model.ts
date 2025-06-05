import mongoose, { Schema, Document } from "mongoose";

export interface IRevenue extends Document {
  subscriptionId: string | mongoose.Schema.Types.ObjectId;
  userSubscriptionPlanId: string | mongoose.Schema.Types.ObjectId;
  trainerId: string | mongoose.Schema.Types.ObjectId;
  userId: string | mongoose.Schema.Types.ObjectId;
  amountPaid: number;
  platformRevenue: number;
  trainerRevenue: number;
  commission: number;
}

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
