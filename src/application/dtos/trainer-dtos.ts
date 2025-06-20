import { ObjectId } from "mongoose";
import { AdminChartData } from "./chart-dtos";
import { ISubscription } from "@domain/entities/subscription.entity";

export interface CreateTrainerDTO {
  fname: string;
  lname: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phone: string;
  specializations: string[];
  certificate: string;
  yearsOfExperience: string;
}

export interface UpdateTrainerDetailsDTO {
  trainerId: string;
  fname: string;
  lname: string;
  phone: string;
  profilePic: string;
  dateOfBirth: string;
  aboutMe: string;
  gender: "male" | "female";
  age: string;
  height: string;
  weight: string;
  userId: string;
  _id: string;
  yearsOfExperience: string;
  certifications: { url: string; fileName: string }[];
  specializations: string[];
}

export interface TrainerVerificationDTO {
  trainerId: string;
  action: "approved" | "rejected";
}

export interface TrainerWithSubscription extends Trainer {
  subscriptionDetails: ISubscription[];
}

export interface Trainer {
  fname: string;
  lname: string;
  email: string;
  password: string;
  role: "user" | "admin" | "trainer";
  isBlocked: boolean;
  otpVerified?: boolean;
  googleVerified?: boolean;
  phone?: string;
  dateOfBirth?: Date;
  profilePic?: string;
  age?: string;
  height?: string;
  weight?: string;
  gender?: string;

  _id: string | ObjectId;
  userId: string | ObjectId;
  yearsOfExperience?: string;
  specializations?: string[];
  certifications?: { fileName: string; url: string }[];
  isApproved?: boolean;
  aboutMe?: string;
}

export interface TrainerDashboardStats {
  chartData: {
    _id: string;
    total: number;
    active: number;
    canceled: number;
  }[];
  pieChartData: {
    _id: string;
    name: string;
    value: number;
  }[];
  totalSubscribersCount: number;
  activeSubscribersCount: number;
  canceledSubscribersCount: number;
}

export interface AdminDashBoardStats {
  pendingTrainerApprovalCount: number;
  totalUsersCount: number;
  totalTrainersCount: number;
  totalPlatFormFee: number;
  totalCommission: number;
  totalRevenue: number;
  chartData: AdminChartData[];
  top5List: Top5List[];
}

export interface Top5List {
  _id: ObjectId;
  totalActiveSubscriptions: number;
  totalCanceledSubscriptions: number;
  totalSubscriptions: number;
  fname: string;
  lname: string;
  email: string;
}