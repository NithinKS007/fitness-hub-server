import { ObjectId } from "mongoose";
import { SubPeriod } from "../../infrastructure/databases/models/subscriptionModel";

export interface Subscription {
  _id: string | ObjectId;
  trainerId: string | ObjectId;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  isBlocked: boolean;
  stripePriceId: string;
}

export interface TrainerSubscriberRecord {
  _id: string | ObjectId;
  durationInWeeks: number;
  price: number;
  sessionsPerWeek: number;
  stripePriceId: string;
  stripeSubscriptionStatus: string;
  stripeSubscriptionId: string;
  subPeriod: SubPeriod;
  totalSessions: number;
  trainerId: string | ObjectId;
  userId: string | ObjectId;
  subscribedUserData: {
    _id: string | ObjectId;
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
    isBlocked: boolean;
  };
}

export interface UserSubscriptionRecord {
  _id: string | ObjectId;
  durationInWeeks: number;
  price: number;
  sessionsPerWeek: number;
  stripePriceId: string;
  stripeSubscriptionStatus: string;
  stripeSubscriptionId: string;
  subPeriod: SubPeriod;
  totalSessions: number;
  trainerId: string | ObjectId;
  userId: string | ObjectId;
  subscribedTrainerData: {
    _id: string | ObjectId;
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
    isBlocked: boolean;
  };
}

export interface UserMyTrainersList {
  _id: string | ObjectId;
  stripeSubscriptionStatus: string;
  trainerId: string | ObjectId;
  userId: string | ObjectId;
  subscribedTrainerData: {
    _id: string | ObjectId;
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
    isBlocked: boolean;
  };
}
interface SubscribedUserData {
  _id: string | ObjectId;
  fname: string;
  lname: string;
  email: string;
  isBlocked: boolean;
  profilePic: string;
}
interface subscribedTrainerData {
  _id: string | ObjectId;
  fname: string;
  lname: string;
  email: string;
  isBlocked: boolean;
  profilePic: string;
}

export interface TrainerSubscribersList {
  _id: string | ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
  stripeSubscriptionId: string;
  subscribedUserData: SubscribedUserData;
  startDate: string;
  endDate: string;
  isActive: string;
  stripeSubscriptionStatus: string;
}

export interface UserSubscriptionsList {
  _id: string | ObjectId;
  userId: string | ObjectId;
  trainerId: string | ObjectId;
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  stripePriceId: string;
  stripeSubscriptionId: string;
  subscribedTrainerData: subscribedTrainerData;
  startDate: string;
  endDate: string;
  isActive: string;
  stripeSubscriptionStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}
