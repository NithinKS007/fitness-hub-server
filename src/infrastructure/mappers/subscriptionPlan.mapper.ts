import { ObjectId } from "mongoose";
import { BaseMapper } from "./BaseMapper";
import { SubPeriod } from "@domain/entities/subscription.entity";

interface BaseTop5Trainers {
  totalActiveSubscriptions: number;
  totalCanceledSubscriptions: number;
  totalSubscriptions: number;
  fname: string;
  lname: string;
  email: string;
}
export type Top5TrainesDBayer = BaseTop5Trainers & {
  _id: ObjectId;
};

export type Top5TrainesUILayer = BaseTop5Trainers & {
  id: string;
};

export class Top5TrainersMapper extends BaseMapper<
  Top5TrainesDBayer,
  Top5TrainesUILayer
> {
  mapToDomain(data: Top5TrainesDBayer): Top5TrainesUILayer {
    return {
      id: this.mapToString(data._id),
      fname: data.fname,
      lname: data.lname,
      email: data.email,
      totalActiveSubscriptions: data.totalActiveSubscriptions,
      totalCanceledSubscriptions: data.totalCanceledSubscriptions,
      totalSubscriptions: data.totalSubscriptions,
    };
  }
  map(data: Top5TrainesDBayer): Top5TrainesUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

interface BaseSubscriptionPlan {
  subPeriod: SubPeriod;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  providerPriceId: string;
  providerSubId: string;
  providerSubStatus: string;
}

interface BaseUser {
  fname: string;
  lname: string;
  email: string;
  profilePic: string;
  isBlocked: boolean;
}

type BaseUserDB = BaseUser & {
  _id: ObjectId;
};
export type BaseUserUI = BaseUser & {
  id: string;
};

type SubscriptionDB = BaseSubscriptionPlan & {
  userId: ObjectId;
  trainerId: ObjectId;
};

export type SubscriptionUI = BaseSubscriptionPlan & {
  userId: string;
  trainerId: string;
};

export type UserSubsDBLayer = SubscriptionDB & {
  trainerData: BaseUserDB;
};

export type UserSubUILayer = SubscriptionUI & {
  trainerData: BaseUserUI;
};

export class UserSubMapper extends BaseMapper<UserSubsDBLayer, UserSubUILayer> {
  mapToDomain(data: UserSubsDBLayer): UserSubUILayer {
    return {
      subPeriod: data.subPeriod,
      price: data.price,
      durationInWeeks: data.durationInWeeks,
      sessionsPerWeek: data.sessionsPerWeek,
      totalSessions: data.totalSessions,
      providerPriceId: data.providerPriceId,
      providerSubId: data.providerSubId,
      providerSubStatus: data.providerSubStatus,
      trainerId: this.mapToString(data.trainerId),
      userId: this.mapToString(data.userId),
      trainerData: {
        id: this.mapToString(data.trainerData._id),
        fname: data.trainerData.fname,
        lname: data.trainerData.lname,
        email: data.trainerData.email,
        profilePic: data.trainerData.profilePic,
        isBlocked: data.trainerData.isBlocked,
      },
    };
  }
  map(data: UserSubsDBLayer): UserSubUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

export type TrainerSubsDBLayer = SubscriptionDB & {
  userData: BaseUserDB;
};

export type TrainerSubUILayer = SubscriptionUI & {
  userData: BaseUserUI;
};

export class TrainerSubMapper extends BaseMapper<
  TrainerSubsDBLayer,
  TrainerSubUILayer
> {
  mapToDomain(data: TrainerSubsDBLayer): TrainerSubUILayer {
    return {
      subPeriod: data.subPeriod,
      price: data.price,
      durationInWeeks: data.durationInWeeks,
      sessionsPerWeek: data.sessionsPerWeek,
      totalSessions: data.totalSessions,
      providerPriceId: data.providerPriceId,
      providerSubId: data.providerSubId,
      providerSubStatus: data.providerSubStatus,
      trainerId: this.mapToString(data.trainerId),
      userId: this.mapToString(data.userId),
      userData: {
        id: this.mapToString(data.userData._id),
        fname: data.userData.fname,
        lname: data.userData.lname,
        email: data.userData.email,
        profilePic: data.userData.profilePic,
        isBlocked: data.userData.isBlocked,
      },
    };
  }
  map(data: TrainerSubsDBLayer): TrainerSubUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}
