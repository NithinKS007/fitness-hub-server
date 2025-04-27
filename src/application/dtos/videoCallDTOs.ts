export interface CreateVideoCallLogDTO {
  appointmentId: string;
  callerId: string;
  receiverId: string;
  callRoomId: string;
  callStartTime: Date;
}

export interface UpdateVideoCallLogDTO {
  callRoomId: string;
  callEndTime: Date;
  callStatus: "pending" | "completed" | "missed";
}

export interface UpdateVideoCallDurationDTO {
  callRoomId: string;
  callDuration: number;
}
