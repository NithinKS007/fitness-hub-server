import { ObjectId } from "mongoose";
import { BaseMapper } from "./BaseMapper";

interface BaseUserData {
  fname: string;
  lname: string;
  email: string;
  profilePic: string;
}

interface UserDataDBLayer extends BaseUserData {
  _id: ObjectId;
}

interface UserDataUILayer extends BaseUserData {
  id: string;
}

interface BaseAppointment {
  appointmentDate: Date;
  appointmentTime: string;
  status: string;
}

interface AppointmentDBLayer extends BaseAppointment {
  _id: ObjectId;
  userId: ObjectId;
  bookingSlotId: ObjectId;
  trainerId: ObjectId;
}

interface AppointmentUILayer extends BaseAppointment {
  id: string;
  userId: string;
  bookingSlotId: string;
  trainerId: string;
}

interface BaseLog {
  callDuration: number;
  callStatus: "pending" | "completed" | "missed";
  callRoomId: string;
  callStartTime: Date;
  callEndTime: Date;
}

interface CallLogDBLayer extends BaseLog {
  _id: ObjectId;
  appointmentId: ObjectId;
  callerId: ObjectId;
  receiverId: ObjectId;
}

interface CallLogUILayer extends BaseLog {
  id: string;
  appointmentId: string;
  callerId: string;
  receiverId: string;
}

interface TRCallLogDBLayer extends CallLogDBLayer {
  appointmentData: AppointmentDBLayer;
  userData: UserDataDBLayer;
}

export interface TRCallLogUILayer extends CallLogUILayer {
  appointmentData: AppointmentUILayer;
  userData: UserDataUILayer;
}

interface URCallLogDBLayer extends CallLogDBLayer {
  appointmentData: AppointmentDBLayer;
  trainerData: UserDataDBLayer;
}

export interface URCallLogUILayer extends CallLogUILayer {
  appointmentData: AppointmentUILayer;
  trainerData: UserDataUILayer;
}

class UserMapper extends BaseMapper<UserDataDBLayer, UserDataUILayer> {
  mapToDomain(data: UserDataDBLayer): UserDataUILayer {
    return { ...data, id: this.mapToString(data._id) };
  }
  map(data: UserDataDBLayer): UserDataUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

class AppointmentMapper extends BaseMapper<
  AppointmentDBLayer,
  AppointmentUILayer
> {
  mapToDomain(data: AppointmentDBLayer): AppointmentUILayer {
    return {
      id: this.mapToString(data._id),
      userId: this.mapToString(data.userId),
      bookingSlotId: this.mapToString(data.bookingSlotId),
      trainerId: this.mapToString(data.trainerId),
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      status: data.status,
    };
  }
  map(data: AppointmentDBLayer): AppointmentUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

class CallLogMapper extends BaseMapper<CallLogDBLayer, CallLogUILayer> {
  mapToDomain(data: CallLogDBLayer): CallLogUILayer {
    return {
      id: this.mapToString(data._id),
      appointmentId: this.mapToString(data.appointmentId),
      callerId: this.mapToString(data.callerId),
      receiverId: this.mapToString(data.receiverId),
      callRoomId: data.callRoomId,
      callDuration: data.callDuration,
      callStartTime: data.callStartTime,
      callEndTime: data.callEndTime,
      callStatus: data.callStatus,
    };
  }
  map(data: CallLogDBLayer): CallLogUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

export class TRCallLogMapper extends BaseMapper<
  TRCallLogDBLayer,
  TRCallLogUILayer
> {
  constructor(
    private userMapper: UserMapper = new UserMapper(),
    private appointmentMapper: AppointmentMapper = new AppointmentMapper(),
    private callLogMapper: CallLogMapper = new CallLogMapper()
  ) {
    super();
  }
  mapToDomain(data: TRCallLogDBLayer): TRCallLogUILayer {
    const userData = this.userMapper.map(data.userData);
    const appointmentData = this.appointmentMapper.map(data.appointmentData);
    const callLogData = this.callLogMapper.map(data);
    return {
      ...callLogData,
      userData: userData,
      appointmentData: appointmentData,
    };
  }
  map(data: TRCallLogDBLayer): TRCallLogUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

export class URCallLogMapper extends BaseMapper<
  URCallLogDBLayer,
  URCallLogUILayer
> {
  constructor(
    private userMapper: UserMapper = new UserMapper(),
    private appointmentMapper: AppointmentMapper = new AppointmentMapper(),
    private callLogMapper: CallLogMapper = new CallLogMapper()
  ) {
    super();
  }
  mapToDomain(data: URCallLogDBLayer): URCallLogUILayer {
    const userData = this.userMapper.map(data.trainerData);
    const appointmentData = this.appointmentMapper.map(data.appointmentData);
    const callLogData = this.callLogMapper.map(data);
    return {
      ...callLogData,
      trainerData: userData,
      appointmentData: appointmentData,
    };
  }
  map(data: URCallLogDBLayer): URCallLogUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}
