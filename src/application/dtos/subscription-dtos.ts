import {
  TrainerSubUILayer,
  UserSubUILayer,
} from "@infrastructure/mappers/subscriptionPlan.mapper";

interface SubscriptionDetails {
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  providerPriceId: string;
  providerSubId: string;
  providerSubStatus: string;
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
  isBlocked: boolean;
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
  providerSubId: string;
  action: string;
}

export interface CheckSubscriptionStatusDTO {
  userId: string;
  trainerId: string;
}

export interface TrainerSubList extends TrainerSubUILayer {
  startDate: string;
  endDate: string;
  serviceSubStatus: string;
}

export interface UserSubList extends UserSubUILayer {
  startDate: string;
  endDate: string;
  serviceSubStatus: string;
}
