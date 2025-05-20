import mongoose, { Schema, Document } from "mongoose";
export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";

interface IUserSubscriptionPlan extends Document {
  _id:mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  trainerId: mongoose.Schema.Types.ObjectId;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
  stripeSubscriptionId:string
  stripeSubscriptionStatus:string
}

const userSubscriptionPlanSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    stripeSubscriptionStatus:{ type: String, required: true }
  },
  { timestamps: true }
);

userSubscriptionPlanSchema.index({ userId: 1, stripeSubscriptionStatus: 1, createdAt: -1 });
userSubscriptionPlanSchema.index({ trainerId: 1, stripeSubscriptionStatus: 1, createdAt: -1 });
userSubscriptionPlanSchema.index({ stripeSubscriptionId: 1 }, { unique: true });

const userSubscriptionPlanModel = mongoose.model<IUserSubscriptionPlan>(
  "UserSubscriptionPlan",
  userSubscriptionPlanSchema
);

export default userSubscriptionPlanModel;
