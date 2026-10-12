import { Model } from "mongoose";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { IVideoCallLogRepository } from "@domain/interfaces/IVideoCallLogRepository";
import {
  GetTrainerVideoCallLogDTO,
  GetUserVideoCallLogDTO,
} from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { VideoCallLog } from "@domain/entities/video-calllog.entity";
import VideoCallLogModel, {
  IVideoCallLog,
} from "../models/video-call-log.model";
import {
  TRCallLogMapper,
  TRCallLogUILayer,
  URCallLogMapper,
  URCallLogUILayer,
} from "@infrastructure/mappers/call-log.mapper";
import { MongoHelper } from "../utils/mongo-helper";

export class VideoCallLogRepository
  extends BaseRepository<IVideoCallLog, VideoCallLog>
  implements IVideoCallLogRepository
{
  constructor(
    model: Model<IVideoCallLog> = VideoCallLogModel,
    private userCallLogMapper: URCallLogMapper = new URCallLogMapper(),
    private trainerCallLogMapper: TRCallLogMapper = new TRCallLogMapper(),
    private utility: MongoHelper = new MongoHelper()
  ) {
    super(
      model,
      "_id appointmentId callerId receiverId callDuration callRoomId callStatus callStartTime callEndTime createdAt updatedAt"
    );
  }

  async getTrainerVideoCallLogs(
    dtos: GetTrainerVideoCallLogDTO
  ): Promise<PagedResponse<TRCallLogUILayer>> {
    const { trainerId, page, limit, search, fromDate, toDate, filters } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    const matchQuery = {
      ...this.utility.dateFilter(
        { fromDate, toDate },
        "appointmentData.appointmentDate"
      ),
      ...this.utility.applyInFilter(
        { filters },
        "appointmentData.appointmentTime"
      ),
      ...this.utility.search({ search }, [
        "userData.fname",
        "userData.lname",
        "userData.email",
      ]),
    };

    const userLookup = this.utility.lookup({
      from: "users",
      localField: "receiverId",
      foreignField: "_id",
      as: "userData",
    });

    const appointmentLookup = this.utility.lookup({
      from: "appointments",
      localField: "appointmentId",
      foreignField: "_id",
      as: "appointmentData",
    });

    const commonPipeline = [
      { $match: { callerId: this.parseId(trainerId) } },
      ...userLookup,
      ...appointmentLookup,
      { $match: matchQuery },
    ];

    const [totalCount, trainerVideoCallLogList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: {
              _id: 1,
              appointmentId: 1,
              callerId: 1,
              receiverId: 1,
              callDuration: 1,
              callRoomId: 1,
              callStatus: 1,
              callStartTime: 1,
              callEndTime: 1,
              "appointmentData._id": 1,
              "appointmentData.userId": 1,
              "appointmentData.bookingSlotId": 1,
              "appointmentData.trainerId": 1,
              "appointmentData.appointmentDate": 1,
              "appointmentData.appointmentTime": 1,
              "appointmentData.status": 1,
              "userData._id": 1,
              "userData.fname": 1,
              "userData.lname": 1,
              "userData.email": 1,
              "userData.profilePic": 1,
            },
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

    const mappedData = trainerVideoCallLogList.map((data) =>
      this.trainerCallLogMapper.map(data)
    );
    return {
      data: mappedData,
      pagination: paginationData,
    };
  }

  async getUserVideoCallLogs(
    dtos: GetUserVideoCallLogDTO
  ): Promise<PagedResponse<URCallLogUILayer>> {
    const { userId, page, limit, search, fromDate, toDate, filters } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    const matchQuery = {
      ...this.utility.dateFilter(
        { fromDate, toDate },
        "appointmentData.appointmentDate"
      ),
      ...this.utility.applyInFilter(
        { filters },
        "appointmentData.appointmentTime"
      ),
      ...this.utility.search({ search }, [
        "trainerData.fname",
        "trainerData.lname",
        "trainerData.email",
      ]),
    };

    const userLookup = this.utility.lookup({
      from: "users",
      localField: "callerId",
      foreignField: "_id",
      as: "trainerData",
    });

    const appointmentLookup = this.utility.lookup({
      from: "appointments",
      localField: "appointmentId",
      foreignField: "_id",
      as: "appointmentData",
    });

    const commonPipeline = [
      { $match: { receiverId: this.parseId(userId) } },
      ...userLookup,
      ...appointmentLookup,
      { $match: matchQuery },
    ];

    const [totalCount, userVideoCallLogList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: {
              _id: 1,
              appointmentId: 1,
              callerId: 1,
              receiverId: 1,
              callDuration: 1,
              callRoomId: 1,
              callStatus: 1,
              callStartTime: 1,
              callEndTime: 1,
              "appointmentData._id": 1,
              "appointmentData.userId": 1,
              "appointmentData.bookingSlotId": 1,
              "appointmentData.trainerId": 1,
              "appointmentData.appointmentDate": 1,
              "appointmentData.appointmentTime": 1,
              "appointmentData.status": 1,
              "trainerData._id": 1,
              "trainerData.fname": 1,
              "trainerData.lname": 1,
              "trainerData.email": 1,
              "trainerData.profilePic": 1,
            },
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

    const mappedData = userVideoCallLogList.map((data) =>
      this.userCallLogMapper.map(data)
    );
    return {
      data: mappedData,
      pagination: paginationData,
    };
  }
}
