import mongoose, { Schema, Document } from 'mongoose';

export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";
export type PlanType = "premium" | "silver" | "gold";

interface ISubscription extends Document {
  _id:string
  trainerId: string;
  subPeriod: SubPeriod;
  planType: PlanType;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isActive: boolean;
}

const SubscriptionSchema: Schema = new Schema({
  trainerId: { type: String, required: true },
  subPeriod: { type: String, enum: ["monthly", "yearly", "quarterly", "halfYearly"], required: true },
  planType: { type: String, enum: ["premium", "silver", "gold"], required: true },
  price: { type: Number, required: true },
  durationInWeeks: { type: Number, required: true },
  sessionsPerWeek: { type: Number, required: true },
  totalSessions: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});


const SubscriptionModel = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default SubscriptionModel;
