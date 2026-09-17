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
