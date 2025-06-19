import { Model } from "mongoose";
import {
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
  TrainerVideoCallLog,
  UserVideoCallLog,
} from "@application/dtos/video-call-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IVideoCallLogRepository } from "@domain/interfaces/IVideoCallLogRepository";
import { GetVideoCallLogQueryDTO } from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { IVideoCallLog } from "@domain/entities/video-calllog.entity";
import VideoCallLogModel from "../models/video-call-log.model";

export class VideoCallLogRepository
  extends BaseRepository<IVideoCallLog>
  implements IVideoCallLogRepository
{
  constructor(

    model: Model<IVideoCallLog> = VideoCallLogModel
  ) {
    super(model);
  }

  private async updateLogField(
    callRoomId: string,
    updates: Record<string, {}>
  ): Promise<IVideoCallLog | null> {
    return await this.model.findOneAndUpdate(
      { callRoomId: callRoomId },
      updates,
      { new: true }
    );
  }

  async updateStatus({
    callRoomId,
    callEndTime,
    callStatus,
  }: UpdateVideoCallLogDTO): Promise<IVideoCallLog | null> {
    return this.updateLogField(callRoomId, { callEndTime, callStatus });
  }

  async updateDuration({
    callRoomId,
    callDuration,
  }: UpdateVideoCallDurationDTO): Promise<void> {
    await this.updateLogField(callRoomId, { callDuration });
  }

  async getTrainerVideoCallLogs(
    trainerId: string,
    { page, limit, search, fromDate, toDate, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    trainerVideoCallLogList: TrainerVideoCallLog[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    let matchQuery: any = {};

    if (search) {
      matchQuery.$or = [
        { "userData.fname": { $regex: search, $options: "i" } },
        { "userData.lname": { $regex: search, $options: "i" } },
        { "userData.email": { $regex: search, $options: "i" } },
      ];
    }
    if (filters && filters.length > 0) {
      matchQuery["appointmentData.appointmentTime"] = { $in: filters };
    }

    if (fromDate && toDate) {
      matchQuery["appointmentData.appointmentDate"] = {
        $gte: fromDate,
        $lte: toDate,
      };
    } else if (fromDate) {
      matchQuery["appointmentData.appointmentDate"] = { $gte: fromDate };
    } else if (toDate) {
      matchQuery["appointmentData.appointmentDate"] = { $lte: toDate };
    }

    const commonPipeline = [
      { $match: { callerId: this.parseId(trainerId) } },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $lookup: {
          from: "appointments",
          localField: "appointmentId",
          foreignField: "_id",
          as: "appointmentData",
        },
      },
      { $match: matchQuery },
      { $unwind: "$appointmentData" },
    ];

    const [totalCount, trainerVideoCallLogList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([...commonPipeline])
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
    return {
      trainerVideoCallLogList,
      paginationData,
    };
  }

  async getUserVideoCallLogs(
    userId: string,
    { page, limit, search, fromDate, toDate, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    userVideoCallLogList: UserVideoCallLog[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    let matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { "trainerData.fname": { $regex: search, $options: "i" } },
        { "trainerData.lname": { $regex: search, $options: "i" } },
        { "trainerData.email": { $regex: search, $options: "i" } },
      ];
    }
    if (filters && filters.length > 0) {
      matchQuery["appointmentData.appointmentTime"] = { $in: filters };
    }

    if (fromDate && toDate) {
      matchQuery["appointmentData.appointmentDate"] = {
        $gte: fromDate,
        $lte: toDate,
      };
    } else if (fromDate) {
      matchQuery["appointmentData.appointmentDate"] = { $gte: fromDate };
    } else if (toDate) {
      matchQuery["appointmentData.appointmentDate"] = { $lte: toDate };
    }

    const commonPipeline = [
      { $match: { receiverId: this.parseId(userId) } },
      {
        $lookup: {
          from: "trainers",
          localField: "callerId",
          foreignField: "_id",
          as: "trainerCollectionData",
        },
      },
      { $unwind: "$trainerCollectionData" },
      {
        $lookup: {
          from: "users",
          localField: "trainerCollectionData.userId",
          foreignField: "_id",
          as: "trainerData",
        },
      },
      { $unwind: "$trainerData" },
      {
        $lookup: {
          from: "appointments",
          localField: "appointmentId",
          foreignField: "_id",
          as: "appointmentData",
        },
      },
      { $match: matchQuery },
      { $unwind: "$appointmentData" },
    ];

    const [totalCount, userVideoCallLogList] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([...commonPipeline])
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
    return {
      userVideoCallLogList,
      paginationData,
    };
  }
}
