interface PersonInfo {
  email: string;
  fname: string;
  lname: string;
  phone: string;
  profilePic: string;
}

export interface Transactions {
  amountPaid: number;
  commission: number;
  createdAt: Date;
  serviceFee: number;
  trainerProfit: number;
  subscriptionId: string;
  userId: string;
  trainerId: string;
  userSubscriptionPlanId: string;
  subscriptionProvidedBy: PersonInfo;
  subscriptionTakenBy: PersonInfo;
  providerSubStatus: string;
  subPeriod: string;
}
