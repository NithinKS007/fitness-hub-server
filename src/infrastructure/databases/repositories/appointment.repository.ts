import { Model } from "mongoose";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import AppointmentModel, {
  IAppointment,
} from "@infrastructure/databases/models/appointment.model";
import {
  GetBookingRequestsDTO,
  GetTrainerSchedulesDTO,
  GetUserSchedulesDTO,
} from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { Appointment } from "@domain/entities/appointment.entity";
import {
  AppointmentsTRUILayer,
  AppointmentsURUILayer,
  AppointmentTRmapper,
  AppointmentURmapper,
} from "@infrastructure/mappers/appointment.mapper";
import { MongoHelper } from "../utils/mongo-helper";

export class AppointmentRepository
  extends BaseRepository<IAppointment, Appointment>
  implements IAppointmentRepository
{
  constructor(
    model: Model<IAppointment> = AppointmentModel,
    private appointmentURMapper: AppointmentURmapper = new AppointmentURmapper(),
    private appointmentTRMapper: AppointmentTRmapper = new AppointmentTRmapper(),
    private utility: MongoHelper = new MongoHelper()
  ) {
    super(model);
  }

  private appointmentProj() {
    return {
      _id: 1,
      appointmentDate: 1,
      appointmentTime: 1,
      trainerId: 1,
      status: 1,
      createdAt: 1,
    };
  }

  private slotProj() {
    return {
      "bookingSlotData.createdAt": 1,
      "bookingSlotData._id": 1,
    };
  }

  async getBookingRequests(
    dtos: GetBookingRequestsDTO
  ): Promise<PagedResponse<AppointmentsTRUILayer>> {
    const { trainerId, page, limit, fromDate, toDate, search, filters } = dtos;

    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    const matchQuery = {
      ...this.utility.dateFilter({ fromDate, toDate }, "appointmentDate"),
      ...this.utility.applyInFilter({ filters }, "appointmentTime"),
      ...this.utility.search({ search }, [
        "userData.fname",
        "userData.lname",
        "userData.email",
      ]),
    };

    const userLookup = this.utility.lookup({
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userData",
    });

    const slotLookup = this.utility.lookup({
      from: "bookingslots",
      localField: "bookingSlotId",
      foreignField: "_id",
      as: "bookingSlotData",
    });

    const commonPipeline = [
      {
        $match: {
          trainerId: this.parseId(trainerId),
          status: "pending",
        },
      },
      ...userLookup,
      ...slotLookup,
      { $match: matchQuery },
    ];

    const projFields = {
      ...this.appointmentProj(),
      ...this.utility.userProj(),
      ...this.slotProj(),
    };

    const [totalCount, bookingRequestsList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: projFields,
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    const mappedData = bookingRequestsList.map((data) =>
      this.appointmentTRMapper.map(data)
    );

    return {
      data: mappedData,
      pagination: paginationData,
    };
  }

  async getTrainerSchedules(
    dtos: GetTrainerSchedulesDTO
  ): Promise<PagedResponse<AppointmentsTRUILayer>> {
    const { trainerId, page, limit, fromDate, toDate, search, filters } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    const matchQuery = {
      ...this.utility.dateFilter({ fromDate, toDate }, "appointmentDate"),
      ...this.utility.applyInFilter({ filters }, "appointmentTime "),
      ...this.utility.search({ search }, [
        "userData.fname",
        "userData.lname",
        "userData.email",
      ]),
    };

    const userLookup = this.utility.lookup({
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userData",
    });

    const slotLookup = this.utility.lookup({
      from: "bookingslots",
      localField: "bookingSlotId",
      foreignField: "_id",
      as: "bookingSlotData",
    });

    const commonPipeline = [
      {
        $match: {
          trainerId: this.parseId(trainerId),
          status: "approved",
        },
      },
      ...userLookup,
      ...slotLookup,
      { $match: matchQuery },
    ];

    const projFields = {
      ...this.appointmentProj(),
      ...this.utility.userProj(),
      ...this.slotProj(),
    };

    const [totalCount, trainerBookingSchedulesList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: projFields,
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

    const mappedData = trainerBookingSchedulesList.map((data) =>
      this.appointmentTRMapper.map(data)
    );

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    return {
      data: mappedData,
      pagination: paginationData,
    };
  }

  async getUserSchedules(
    dtos: GetUserSchedulesDTO
  ): Promise<PagedResponse<AppointmentsURUILayer>> {
    const { userId, page, limit, fromDate, toDate, search, filters } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    const matchQuery = {
      ...this.utility.dateFilter({ fromDate, toDate }, "appointmentDate"),
      ...this.utility.applyInFilter({ filters }, "appointmentTime "),
      ...this.utility.search({ search }, [
        "trainerData.fname",
        "trainerData.lname",
        "trainerData.email",
      ]),
    };

    const trainerLookup = this.utility.lookup({
      from: "users",
      localField: "trainerId",
      foreignField: "_id",
      as: "trainerData",
    });

    const slotLookup = this.utility.lookup({
      from: "bookingslots",
      localField: "bookingSlotId",
      foreignField: "_id",
      as: "bookingSlotData",
    });

    const commonPipeline = [
      {
        $match: {
          userId: this.parseId(userId),
        },
      },
      ...trainerLookup,
      ...slotLookup,
      { $match: matchQuery },
    ];

    const projFields = {
      ...this.appointmentProj(),
      ...this.utility.trainerProj(),
      ...this.slotProj(),
    };

    const [totalCount, appointmentList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: projFields,
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

    const mappedList = appointmentList.map((data) =>
      this.appointmentURMapper.map(data)
    );

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    return {
      data: mappedList,
      pagination: paginationData,
    };
  }
}
