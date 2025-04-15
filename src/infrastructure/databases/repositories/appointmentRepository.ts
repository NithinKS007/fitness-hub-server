import mongoose from "mongoose";
import {
  HandleBookingRequestDTO,
  CreateAppointmentDTO,
} from "../../../application/dtos/bookingDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import {
  Appointment,
  AppointmentRequestsTrainer,
  AppointmentRequestsUser,
} from "../../../domain/entities/appointmentEntity";
import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";
import appointmentModel from "../models/appointmentModel";
import {
  GetBookingRequestsDTO,
  GetBookingSchedulesDTO,
} from "../../../application/dtos/queryDTOs";
const today = new Date();
today.setUTCHours(0, 0, 0, 0);

export class MongoAppointmentRepository implements IAppointmentRepository {
  public async createAppointment(
    appointmentData: CreateAppointmentDTO
  ): Promise<Appointment> {
    return await appointmentModel.create(appointmentData);
  }
  public async getBookingAppointmentRequests(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetBookingRequestsDTO
  ): Promise<{
    bookingRequestsList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    let matchQuery: any = {};

    if (trainerId) {
      if (search) {
        matchQuery.$or = [
          { "userData.fname": { $regex: search, $options: "i" } },
          { "userData.lname": { $regex: search, $options: "i" } },
          { "userData.email": { $regex: search, $options: "i" } },
        ];
      }
      if (filters && filters.length > 0) {
        matchQuery.appointmentTime = { $in: filters };
      }

      if (fromDate && toDate) {
        matchQuery.appointmentDate = { $gte: fromDate, $lte: toDate };
      } else if (fromDate) {
        matchQuery.appointmentDate = { $gte: fromDate };
      } else if (toDate) {
        matchQuery.appointmentDate = { $lte: toDate };
      }
    }
    const [totalCount, bookingRequestsList] = await Promise.all([
      appointmentModel
        .aggregate([
          {
            $match: {
              trainerId: new mongoose.Types.ObjectId(trainerId),
              status: "pending",
              appointmentDate: { $gte: today },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userData",
            },
          },
          { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "bookingslots",
              localField: "bookingSlotId",
              foreignField: "_id",
              as: "bookingSlotData",
            },
          },
          {
            $unwind: {
              path: "$bookingSlotData",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $match: matchQuery },
          { $count: "totalCount" },
        ])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      appointmentModel
        .aggregate([
          {
            $match: {
              trainerId: new mongoose.Types.ObjectId(trainerId),
              status: "pending",
              appointmentDate: { $gte: today },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userData",
            },
          },
          { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "bookingslots",
              localField: "bookingSlotId",
              foreignField: "_id",
              as: "bookingSlotData",
            },
          },
          {
            $unwind: {
              path: "$bookingSlotData",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $match: matchQuery },
          {
            $project: {
              _id: 1,
              appointmentDate: 1,
              appointmentTime: 1,
              trainerId: 1,
              status: 1,
              createdAt: 1,

              "userData._id": 1,
              "userData.fname": 1,
              "userData.lname": 1,
              "userData.email": 1,
              "userData.phone": 1,
              "userData.profilePic": 1,

              "bookingSlotData.createdAt": 1,
              "bookingSlotData._id": 1,
            },
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      bookingRequestsList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  public async approveOrRejectAppointment({
    appointmentId,
    action,
  }: HandleBookingRequestDTO): Promise<Appointment | null> {
    return await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: action },
      { new: true }
    );
  }
  public async getTrainerBookingSchedules(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetBookingSchedulesDTO
  ): Promise<{
    trainerBookingSchedulesList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { "userData.fname": { $regex: search, $options: "i" } },
        { "userData.lname": { $regex: search, $options: "i" } },
        { "userData.email": { $regex: search, $options: "i" } },
      ];
    }
    if (filters && filters.length > 0) {
      matchQuery.appointmentTime = { $in: filters };
    }

    if (fromDate && toDate) {
      matchQuery.appointmentDate = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
      matchQuery.appointmentDate = { $gte: fromDate };
    } else if (toDate) {
      matchQuery.appointmentDate = { $lte: toDate };
    }

    const [totalCount, trainerBookingSchedulesList] = await Promise.all([
      appointmentModel
        .aggregate([
          {
            $match: {
              trainerId: new mongoose.Types.ObjectId(trainerId),
              status: "approved",
              appointmentDate: { $gte: today },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userData",
            },
          },
          { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "bookingslots",
              localField: "bookingSlotId",
              foreignField: "_id",
              as: "bookingSlotData",
            },
          },
          {
            $unwind: {
              path: "$bookingSlotData",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $match: matchQuery },
          { $count: "totalCount" },
        ])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      appointmentModel
        .aggregate([
          {
            $match: {
              trainerId: new mongoose.Types.ObjectId(trainerId),
              status: "approved",
              appointmentDate: { $gte: today },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userData",
            },
          },
          { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "bookingslots",
              localField: "bookingSlotId",
              foreignField: "_id",
              as: "bookingSlotData",
            },
          },
          {
            $unwind: {
              path: "$bookingSlotData",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $match: matchQuery },
          {
            $project: {
              _id: 1,
              appointmentDate: 1,
              appointmentTime: 1,
              trainerId: 1,
              status: 1,
              createdAt: 1,

              "userData._id": 1,
              "userData.fname": 1,
              "userData.lname": 1,
              "userData.email": 1,
              "userData.phone": 1,
              "userData.profilePic": 1,

              "bookingSlotData.createdAt": 1,
              "bookingSlotData._id": 1,
            },
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);
    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      trainerBookingSchedulesList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }
  public async getUserBookingSchedules(
    userId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetBookingSchedulesDTO
  ): Promise<{
    appointmentList: AppointmentRequestsUser[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    let matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { "trainerData.fname": { $regex: search, $options: "i" } },
        { "trainerData.lname": { $regex: search, $options: "i" } },
        { "trainerData.email": { $regex: search, $options: "i" } },
      ];
    }
    if (filters && filters.length > 0) {
      matchQuery.appointmentTime = { $in: filters };
    }

    if (fromDate && toDate) {
      matchQuery.appointmentDate = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
      matchQuery.appointmentDate = { $gte: fromDate };
    } else if (toDate) {
      matchQuery.appointmentDate = { $lte: toDate };
    }

    const [totalCount, appointmentList] = await Promise.all([
      appointmentModel
        .aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
              appointmentDate: { $gte: today },
            },
          },
          {
            $lookup: {
              from: "trainers",
              localField: "trainerId",
              foreignField: "_id",
              as: "trainerCollectionData",
            },
          },
          {
            $unwind: {
              path: "$trainerCollectionData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "trainerCollectionData.userId",
              foreignField: "_id",
              as: "trainerData",
            },
          },
          {
            $unwind: { path: "$trainerData", preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: "bookingslots",
              localField: "bookingSlotId",
              foreignField: "_id",
              as: "bookingSlotData",
            },
          },
          {
            $unwind: {
              path: "$bookingSlotData",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $match: matchQuery },
          { $count: "totalCount" },
        ])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      appointmentModel
        .aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId),
              appointmentDate: { $gte: today },
            },
          },
          {
            $lookup: {
              from: "trainers",
              localField: "trainerId",
              foreignField: "_id",
              as: "trainerCollectionData",
            },
          },
          {
            $unwind: {
              path: "$trainerCollectionData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "trainerCollectionData.userId",
              foreignField: "_id",
              as: "trainerData",
            },
          },
          {
            $unwind: { path: "$trainerData", preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: "bookingslots",
              localField: "bookingSlotId",
              foreignField: "_id",
              as: "bookingSlotData",
            },
          },
          {
            $unwind: {
              path: "$bookingSlotData",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $match: matchQuery },
          {
            $project: {
              _id: 1,
              appointmentDate: 1,
              appointmentTime: 1,
              trainerId: 1,
              status: 1,
              createdAt: 1,

              "trainerData._id": "$trainerCollectionData._id",
              "trainerData.fname": 1,
              "trainerData.lname": 1,
              "trainerData.email": 1,
              "trainerData.phone": 1,
              "trainerData.profilePic": 1,

              "bookingSlotData.createdAt": 1,
              "bookingSlotData._id": 1,
            },
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      appointmentList: appointmentList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  public async cancelAppointmentSchedule(
    appointmentId: IdDTO
  ): Promise<Appointment | null> {
    return await appointmentModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(appointmentId),
      { status: "cancelled" },
      { new: true }
    );
  }

  public async getAppointmentById(
    appointmentId: IdDTO
  ): Promise<Appointment | null> {
    return await appointmentModel.findOne(
      new mongoose.Types.ObjectId(appointmentId)
    );
  }
}
