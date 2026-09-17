import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IFinancialLog extends Document {
  _id: ObjectId;
  subscriptionId: ObjectId;
  userSubscriptionPlanId: ObjectId;
  trainerId: ObjectId;
  userId: ObjectId;
  amountPaid: number;
  serviceFee: number;
  trainerProfit: number;
  commission: number;
  createdAt: Date;
  updatedAt: Date;
}

const financialLogSchema: Schema = new Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid subscription id");
        }
      },
    },
    userSubscriptionPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSubscriptionPlan",
      required: true,
      set: (value: string) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return new mongoose.Types.ObjectId(value);
        } else {
          throw new Error("Please provide a valid user subscription plan id");
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
    amountPaid: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => {
          return value >= 0;
        },
        message: "Amount paid must be a positive number",
      },
    },
    serviceFee: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => {
          return value >= 0;
        },
        message: "Platform revenue must be a positive number",
      },
    },
    trainerProfit: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => {
          return value >= 0;
        },
        message: "Trainer revenue must be a positive number",
      },
    },
    commission: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => {
          return value >= 0;
        },
        message: "Commission must be a positive number",
      },
    },
  },
  { timestamps: true }
);

const FinancialLogModal = mongoose.model<IFinancialLog>(
  "FinancialLog",
  financialLogSchema
);

export default FinancialLogModal;
