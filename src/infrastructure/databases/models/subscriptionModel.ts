import mongoose, { Schema, Document } from 'mongoose';

export type SubPeriod = "monthly" | "yearly" | "quarterly" | "halfYearly";

interface ISubscription extends Document {
  _id:string
  trainerId: mongoose.Schema.Types.ObjectId;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
  stripePriceId: string;
}

const SubscriptionSchema: Schema = new Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId,ref:"User", required: true },
  subPeriod: { type: String, enum: ["monthly", "yearly", "quarterly", "halfYearly"], required: true },
  price: { type: Number, required: true },
  durationInWeeks: { type: Number, required: true },
  sessionsPerWeek: { type: Number, required: true },
  totalSessions: { type: Number, required: true },
  isBlocked: { type: Boolean, default: false },
  stripePriceId: { type: String,required:true}
});


const SubscriptionModel = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default SubscriptionModel;
