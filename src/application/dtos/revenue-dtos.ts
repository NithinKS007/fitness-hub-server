interface PersonInfo {
  email: string;
  fname: string;
  lname: string;
  phone: string;
  profilePic: string;
}

interface SubscriptionPlanData {
  stripeSubscriptionStatus: string;
  subPeriod: string;
}

export interface PlatformRevenue {
  amountPaid: number;
  commission: number;
  createdAt: Date;
  platformRevenue: number;
  trainerRevenue: number;
  subscriptionId: string;
  userId: string;
  trainerId: string;
  userSubscriptionPlanId: string;
  subscriptionProvidedBy: PersonInfo;
  subscriptionTakenBy: PersonInfo;
  subscriptionPlanData: SubscriptionPlanData;
}
