import { Model } from "mongoose";
import { PaginationDTO } from "../../../application/dtos/utility-dtos";
import {
  AppointmentRequestsTrainer,
  AppointmentRequestsUser,
} from "../../../domain/entities/appointment.entities";
import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";
import AppointmentModel, { IAppointment } from "../models/appointment.model";
import {
  GetBookingRequestsDTO,
  GetBookingSchedulesDTO,
} from "../../../application/dtos/query-dtos";
import { BaseRepository } from "./base.repository";

export class AppointmentRepository
  extends BaseRepository<IAppointment>
  implements IAppointmentRepository
{
  constructor(model: Model<IAppointment> = AppointmentModel) {
    super(model);
  }

  async getBookingRequests(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetBookingRequestsDTO
  ): Promise<{
    bookingRequestsList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;
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

    const commonPipeline = [
      {
        $match: {
          trainerId: this.parseId(trainerId),
          status: "pending",
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
    ];

    const [totalCount, bookingRequestsList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
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

  async getTrainerSchedules(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetBookingSchedulesDTO
  ): Promise<{
    trainerBookingSchedulesList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;
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

    const commonPipeline = [
      {
        $match: {
          trainerId: this.parseId(trainerId),
          status: "approved",
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
    ];

    const [totalCount, trainerBookingSchedulesList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
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
  async getUserSchedules(
    userId: string,
    { page, limit, fromDate, toDate, search, filters }: GetBookingSchedulesDTO
  ): Promise<{
    appointmentList: AppointmentRequestsUser[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;
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

    const commonPipeline = [
      {
        $match: {
          userId: this.parseId(userId),
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
    ];

    const [totalCount, appointmentList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
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
}
