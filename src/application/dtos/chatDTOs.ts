export interface CreateChatDTO {
  senderId: string;
  receiverId: string;
  message: string;
}

export interface FindChatDTO {
  userId: string;
  otherUserId: string;
}

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
  callStatus: string;
}

export interface UpdateVideoCallDurationDTO {
  callRoomId: string;
  callDuration: number;
}
