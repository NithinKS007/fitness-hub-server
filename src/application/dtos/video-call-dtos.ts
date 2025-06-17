import { ObjectId } from "mongoose";

interface VideoCallLogBaseDTO {
  callRoomId: string;
}

export interface CreateVideoCallLogDTO extends VideoCallLogBaseDTO {
  appointmentId: string;
  callerId: string;
  receiverId: string;
  callStartTime: Date;
}

export interface UpdateVideoCallLogDTO extends VideoCallLogBaseDTO {
  callEndTime: Date;
  callStatus: "pending" | "completed" | "missed";
}

export interface UpdateVideoCallDurationDTO extends VideoCallLogBaseDTO {
  callDuration: number;
}

interface CommonVideoCallLog {
  _id: ObjectId | string;
  appointmentId: ObjectId | string;
  callDuration: number;
  callStatus: "pending" | "completed" | "missed";
  callStartTime: Date;
  callEndTime: Date;
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

interface TrainerData {
  _id: ObjectId;
  fname: string;
  lname: string;
  email: string;
  profilePic: string;
}

interface UserData {
  _id: ObjectId;
  fname: string;
  lname: string;
  email: string;
  profilePic: string;
}

export interface TrainerVideoCallLog extends CommonVideoCallLog {
  userData: TrainerData;
}

export interface UserVideoCallLog extends CommonVideoCallLog {
  trainerData: UserData;
}
