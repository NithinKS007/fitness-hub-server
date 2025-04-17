export interface CreateChatDTO {
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
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

export interface CountUnReadMessages {
  senderId: string;
  receiverId: string;
}
