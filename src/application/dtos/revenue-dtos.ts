export interface AdminRevenueHistory {
  amountPaid: number;
  commission: number;
  createdAt: Date;
  platformRevenue: number;
  trainerRevenue: number;
  subscriptionId: string;
  userId: string;
  trainerId: string;
  userSubscriptionPlanId: string;
  subscriptionProvidedBy: {
    email: string;
    fname: string;
    lname: string;
    phone: string;
    profilePic: string;
  };
  subscriptionTakenBy: {
    email: string;
    fname: string;
    lname: string;
    phone: string;
    profilePic: string;
  };
  subscriptionPlanData: {
    stripeSubscriptionStatus: string;
    subPeriod: string;
  };
}
