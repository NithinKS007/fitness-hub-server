import { ObjectId } from "mongoose";

interface UserTrainerData {
  _id: string | ObjectId;
  fname: string;
  lname: string;
  email: string;
  profilePic: string;
  isBlocked: boolean;
}

interface SubscriptionDetails {
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
  stripeSubscriptionId: string;
  stripeSubscriptionStatus: string;
}

export enum CancelSubAction {
  immediately = "cancelImmediately",
  atEndOfCycle = "cancelAtEndOfCycle",
}

export enum PeriodType {
  Quarterly = "quarterly",
  HalfYearly = "halfYearly",
  Yearly = "yearly",
  Monthly = "monthly",
}

export type SubPeriod = PeriodType;

export enum SubscriptionInterval {
  Month = "month",
  Year = "year",
}

export interface FindExistingSubscriptionDTO {
  trainerId: string;
  subPeriod: SubPeriod;
}

export interface UpdateSubscriptionBlockStatusDTO {
  subscriptionId: string;
  isBlocked: string;
}

export interface UpdateSubscriptionDetailsDTO extends SubscriptionDetails {
  subscriptionId: string;
  trainerId: string;
}

export interface PurchaseSubscriptionDTO {
  subscriptionId: string;
  userId: string;
}

export interface CancelSubscriptionDTO {
  stripeSubscriptionId: string;
  action: string;
}

export interface CheckSubscriptionStatusDTO {
  userId: string;
  trainerId: string;
}

export interface UpdateSubscriptionStatusDTO {
  stripeSubscriptionId: string;
  status: string;
}

export interface SubscriptionRecord extends SubscriptionDetails {
  userId: string | ObjectId;
  trainerId: string | ObjectId;
}

export interface TrainerSubscriberRecord extends SubscriptionRecord {
  subscribedUserData: UserTrainerData;
}

export interface UserSubscriptionRecord extends SubscriptionRecord {
  subscribedTrainerData: UserTrainerData;
}

export interface UserMyTrainersList {
  _id: string | ObjectId;
  stripeSubscriptionStatus: string;
  trainerId: string | ObjectId;
  userId: string | ObjectId;
  subscribedTrainerData: UserTrainerData;
}

export interface TrainerSubscribersList extends SubscriptionRecord {
  subscribedUserData: UserTrainerData;
  startDate: string;
  endDate: string;
  isActive: string;
}

export interface UserSubscriptionsList extends SubscriptionRecord {
  subscribedTrainerData: UserTrainerData;
  startDate: string;
  endDate: string;
  isActive: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Top10Trainers {
  fname: string;
  lname: string;
  email: string;
}
