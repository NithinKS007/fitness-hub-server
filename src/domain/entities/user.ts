import { ObjectId } from "mongoose";
import { WorkoutChartData } from "./workout";

export interface User {
  _id: string | ObjectId
  fname: string;
  lname: string;
  email: string;
  role:"user"| "admin"| "trainer";
  isBlocked: boolean;
  password : string;
  otpVerified?: boolean;
  googleVerified?: boolean;
  phone?: string;
  dateOfBirth?: Date;
  profilePic?: string;
  age?: string;
  height?: string;
  weight?: string;
  gender?: "male" | "female";
  
  bloodGroup?: string;
  medicalConditions?: string;
  otherConcerns?: string;
}

export interface UserDashBoard {
  chartData:WorkoutChartData[]
  totalWorkoutTime:number
  todaysTotalPendingWorkouts:number
  todaysTotalCompletedWorkouts:number
}