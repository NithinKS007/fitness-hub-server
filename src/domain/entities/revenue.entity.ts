export interface Revenue {
  _id: string;
  subscriptionId: string;
  userSubscriptionPlanId: string;
  trainerId: string;
  userId: string;
  amountPaid: number;
  platformRevenue: number;
  trainerRevenue: number;
  commission: number;
}
