import { Message } from "@domain/entities/message.entity";

export interface WeightLiftedByDateUILayer {
  date: string;
  totalWeight: number;
}

export interface VideoUILayer {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  video: string;
  privacy: boolean;
  playLists: Array<{
    id: string;
    trainerId: string;
    title: string;
    videoCount: number;
    privacy: boolean;
  }>;
}

interface AppointmentReadModel {
  appointmentTime: string;
  status: string;
  createdAt: Date;
  appointmentDate: Date;
  bookingSlotData: { id: string; createdAt: Date };
  trainerId: string;
}
interface ContactReadModel {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  profilePic: string;
  isBlocked: boolean;
}
export interface AppointmentsURUILayer extends AppointmentReadModel {
  trainerData: ContactReadModel;
}
export interface AppointmentsTRUILayer extends AppointmentReadModel {
  userData: ContactReadModel;
}

interface CallLogReadModel {
  id: string;
  appointmentId: string;
  callerId: string;
  receiverId: string;
  callDuration: number;
  callStatus: "pending" | "completed" | "missed";
  callRoomId: string;
  callStartTime: Date;
  callEndTime: Date;
  appointmentData: {
    id: string;
    userId: string;
    bookingSlotId: string;
    trainerId: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: string;
  };
}
interface CallUserReadModel {
  id: string;
  fname: string;
  lname: string;
  email: string;
  profilePic: string;
}
export interface TRCallLogUILayer extends CallLogReadModel {
  userData: CallUserReadModel;
}
export interface URCallLogUILayer extends CallLogReadModel {
  trainerData: CallUserReadModel;
}

interface ChatReadModel {
  id: string;
  userId: string;
  trainerId: string;
  unreadCount: number;
  providerSubStatus: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: Message | null;
}
interface ChatUserReadModel {
  id: string;
  fname: string;
  lname: string;
  email: string;
  profilePic: string;
  isBlocked: boolean;
}
export interface URChatListUILayer extends ChatReadModel {
  trainerData: ChatUserReadModel;
}
export interface TRChatListUILayer extends ChatReadModel {
  userData: ChatUserReadModel;
}
export interface UserMyTRListUILayer {
  id: string;
  trainerId: string;
  userId: string;
  providerSubStatus: string;
  trainerData: ChatUserReadModel;
}

export interface TRSubStatusWiseCountUI {
  id: string;
  total: number;
  active: number;
  canceled: number;
}
export interface TRSubPeriodWiseCountUI {
  id: string;
  name: string;
  value: number;
}
export interface EarningsOverViewUI {
  id: string;
  serviceFee: number;
  commission: number;
  totalProfit: number;
}
export interface Top5TrainesUILayer {
  id: string;
  totalActiveSubscriptions: number;
  totalCanceledSubscriptions: number;
  totalSubscriptions: number;
  fname: string;
  lname: string;
  email: string;
}
export interface UserSubUILayer {
  subPeriod: string;
  price: number;
  durationInWeeks: number;
  sessionsPerWeek: number;
  totalSessions: number;
  providerPriceId: string;
  providerSubId: string;
  providerSubStatus: string;
  userId: string;
  trainerId: string;
  trainerData: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
    isBlocked: boolean;
  };
}
export interface TrainerSubUILayer extends Omit<UserSubUILayer, "trainerData"> {
  userData: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    profilePic: string;
    isBlocked: boolean;
  };
}
