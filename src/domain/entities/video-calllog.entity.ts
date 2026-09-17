export interface VideoCallLog {
  id: string;
  appointmentId: string;
  callerId: string;
  receiverId: string;
  callDuration: number;
  callRoomId: string;
  callStatus: "pending" | "completed" | "missed";
  callStartTime: Date;
  callEndTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
