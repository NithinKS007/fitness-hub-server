import mongoose, { Schema, Document } from 'mongoose';

export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";

interface ISubscription extends Document {
  _id:string
  trainerId: string;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
}

const SubscriptionSchema: Schema = new Schema({
  trainerId: { type: String, required: true },
  subPeriod: { type: String, enum: ["monthly", "yearly", "quarterly", "halfYearly"], required: true },
  price: { type: Number, required: true },
  durationInWeeks: { type: Number, required: true },
  sessionsPerWeek: { type: Number, required: true },
  totalSessions: { type: Number, required: true },
  isBlocked: { type: Boolean, default: false }
});


const SubscriptionModel = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default SubscriptionModel;
