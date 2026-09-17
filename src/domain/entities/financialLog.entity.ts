export interface financialLog {
  id: string;
  subscriptionId: string;
  userSubscriptionPlanId: string;
  trainerId: string;
  userId: string;
  amountPaid: number;
  serviceFee: number;
  trainerProfit: number;
  commission: number;
  createdAt: Date;
  updatedAt: Date;
}
