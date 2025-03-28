import { ObjectId } from "mongoose";

export interface VideoCallLog {
  _id: ObjectId | string;
  appointmentId: ObjectId | string;
  callDuration: number;
  callStatus: "pending" | "completed" | "missed";
  callStartTime: Date;
  callEndTime: Date;
}

export interface TrainerVideoCallLog {
  _id: ObjectId | string;
  appointmentId: ObjectId | string;
  callDuration: number;
  callStatus: "pending" | "completed" | "missed";
  callStartTime: Date;
  callEndTime: Date;
  userData: {
    _id: ObjectId;
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
  };
  appointmentData: {
    _id: ObjectId;
    userId: ObjectId;
    bookingSlotId: ObjectId;
    trainerId: ObjectId;
    appointmentDate: Date;
    appointmentTime: string;
    status: string;
  };
}

export interface UserVideoCallLog {
  _id: ObjectId | string;
  appointmentId: ObjectId | string;
  callDuration: number;
  callStatus: "pending" | "completed" | "missed";
  callStartTime: Date;
  callEndTime: Date;
  trainerData: {
    _id: ObjectId;
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
  };
  appointmentData: {
    _id: ObjectId;
    userId: ObjectId;
    bookingSlotId: ObjectId;
    trainerId: ObjectId;
    appointmentDate: Date;
    appointmentTime: string;
    status: string;
  };
}

