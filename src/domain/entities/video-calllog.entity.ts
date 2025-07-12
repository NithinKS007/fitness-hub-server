export interface VideoCallLog {
  _id: string;
  appointmentId: string;
  callerId: string;
  receiverId: string;
  callDuration: number;
  callRoomId: string;
  callStatus: "pending" | "completed" | "missed";
  callStartTime: Date;
  callEndTime: Date;
}
