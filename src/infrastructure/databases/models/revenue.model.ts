import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IRevenue extends Document {
  _id: ObjectId;
  subscriptionId: string | ObjectId;
  userSubscriptionPlanId: string | ObjectId;
  trainerId: string | ObjectId;
  userId: string | ObjectId;
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
          : (() => {
              throw new Error("Please provide a valid subscription id");
            })();
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
          : (() => {
              throw new Error("Please provide a valid user subscription plan id");
            })();
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
          : (() => {
              throw new Error("Please provide a valid trainer id");
            })();
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
          : (() => {
              throw new Error("Please provide a valid user id");
            })();
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
