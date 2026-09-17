import mongoose, { Schema, Document, ObjectId } from "mongoose";

type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";

export interface IUserSubscriptionPlan extends Document {
  _id: ObjectId;
  userId: ObjectId;
  trainerId: ObjectId;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
  stripeSubscriptionId: string;
  stripeSubscriptionStatus: string;
}

const userSubscriptionPlanSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid user id");
        }
      },
    },

    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid trainer id");
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
        validator: (value: number) => value > 0,
        message: "Price must be greater than zero",
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
      min: [1, "Sessions per week must be at least 1"],
    },
    totalSessions: {
      type: Number,
      required: true,
      min: [1, "Total sessions must be at least 1"],
    },
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
