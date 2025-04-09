import mongoose, { Schema, Document } from 'mongoose';

interface IRevenue extends Document {
  subscriptionId: mongoose.Schema.Types.ObjectId;
  userSubscriptionPlanId:mongoose.Schema.Types.ObjectId
  trainerId: mongoose.Schema.Types.ObjectId;
  userId:mongoose.Schema.Types.ObjectId;
  amountPaid: number;
  platformRevenue: number;
  trainerRevenue: number;
  commission:number
}

const revenueSchema: Schema = new Schema({
  subscriptionId: { type:  mongoose.Schema.Types.ObjectId, ref: 'Subscription',required: true },
  userSubscriptionPlanId: { type:  mongoose.Schema.Types.ObjectId, ref: 'UserSubscriptionPlan',required: true },
  trainerId: { type:  mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  userId: { type:  mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amountPaid: { type: Number, required: true },
  platformRevenue: { type: Number, required: true },
  trainerRevenue: { type: Number, required: true },
  commission: { type: Number, required: true },
}, { timestamps: true });

const revenueModel = mongoose.model<IRevenue>('Revenue', revenueSchema);

export default revenueModel