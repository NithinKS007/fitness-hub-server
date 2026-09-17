import { ObjectId } from "mongoose";
import { BaseMapper } from "./BaseMapper";

interface UserBase {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  profilePic: string;
  isBlocked:boolean
}

interface BookingSlotBase {
  createdAt: Date;
}

interface AppointmentBase {
  appointmentTime: string;
  status: string;
  createdAt: Date;
  bookingSlotData: BookingSlotBase;
}

export type AppointmentsURdbLayer = AppointmentBase & {
  _id: ObjectId;
  appointmentDate: Date;
  bookingSlotData: BookingSlotBase & { _id: ObjectId };
  trainerId: ObjectId;
  trainerData: UserBase & { _id: ObjectId };
};

export type AppointmentsURUILayer = AppointmentBase & {
  id: string;
  appointmentDate: Date;
  bookingSlotData: BookingSlotBase & { id: string };
  trainerId: string;
  trainerData: UserBase & { id: string };
};

export type AppointmentsTRdbLayer = AppointmentBase & {
  _id: ObjectId;
  appointmentDate: Date;
  bookingSlotData: BookingSlotBase & { _id: ObjectId };
  trainerId: ObjectId;
  userData: UserBase & { _id: ObjectId };
};

export type AppointmentsTRUILayer = AppointmentBase & {
  id: string;
  appointmentDate: Date;
  bookingSlotData: BookingSlotBase & { id: string };
  trainerId: string;
  userData: UserBase & { id: string };
};

export class AppointmentURmapper extends BaseMapper<
  AppointmentsURdbLayer,
  AppointmentsURUILayer
> {
  mapToDomain(data: AppointmentsURdbLayer): AppointmentsURUILayer {
    return {
      id: this.mapToString(data?._id),
      appointmentDate: data?.appointmentDate,
      appointmentTime: data?.appointmentTime,
      trainerId: this.mapToString(data?.trainerId),
      status: data?.status,
      createdAt: data?.createdAt,
      bookingSlotData: {
        id: this.mapToString(data?.bookingSlotData?._id),
        createdAt: data?.bookingSlotData?.createdAt,
      },
      trainerData: {
        id: this.mapToString(data?.trainerData?._id),
        fname: data.trainerData.fname,
        lname: data.trainerData.lname,
        email: data.trainerData.email,
        phone: data.trainerData.phone,
        profilePic: data.trainerData.profilePic,
        isBlocked:data.trainerData.isBlocked
      },
    };
  }

  map(data: AppointmentsURdbLayer): AppointmentsURUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

export class AppointmentTRmapper extends BaseMapper<
  AppointmentsTRdbLayer,
  AppointmentsTRUILayer
> {
  mapToDomain(data: AppointmentsTRdbLayer): AppointmentsTRUILayer {
    return {
      id: this.mapToString(data._id),
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      trainerId: this.mapToString(data.trainerId),
      status: data.status,
      createdAt: data.createdAt,
      bookingSlotData: {
        id: this.mapToString(data.bookingSlotData._id),
        createdAt: data.bookingSlotData.createdAt,
      },
      userData: {
        id: this.mapToString(data.userData._id),
        fname: data.userData.fname,
        lname: data.userData.lname,
        email: data.userData.email,
        phone: data.userData.phone,
        profilePic: data.userData.profilePic,
        isBlocked:data.userData.isBlocked
      },
    };
  }
  map(data: AppointmentsTRdbLayer): AppointmentsTRUILayer {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}
