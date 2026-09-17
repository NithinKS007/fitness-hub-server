import { EarningsOverViewUI } from "@infrastructure/mappers/chart.mappers";
import { Top5TrainesUILayer } from "@infrastructure/mappers/subscriptionPlan.mapper";

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
  id: string;
  yearsOfExperience: string;
  certifications: { url: string; fileName: string }[];
  specializations: string[];
}

export interface TrainerVerificationDTO {
  trainerId: string;
  action: "approved" | "rejected";
}

export interface TrainerDashboardStats {
  chartData: {
    id: string;
    total: number;
    active: number;
    canceled: number;
  }[];
  pieChartData: {
    id: string;
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
  totalServiceFee: number;
  totalCommission: number;
  totalRevenue: number;
  earningOverView: EarningsOverViewUI[];
  Top5Trainers: Top5TrainesUILayer[];
}
