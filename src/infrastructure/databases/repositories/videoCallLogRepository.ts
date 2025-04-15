import mongoose from "mongoose";
import {
  CreateVideoCallLogDTO,
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
} from "../../../application/dtos/chatDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import videoCallLogModel from "../models/videoCallLog";
import {
  TrainerVideoCallLog,
  UserVideoCallLog,
  VideoCallLog,
} from "../../../domain/entities/videoCallLogEntity";
import { GetVideoCallLogQueryDTO } from "../../../application/dtos/queryDTOs";

export class MongoVideoCallLogRepository implements IVideoCallLogRepository {
  public async createCallLog({
    appointmentId,
    callerId,
    receiverId,
    callStartTime,
    callRoomId,
  }: CreateVideoCallLogDTO): Promise<void> {
    await videoCallLogModel.create({
      appointmentId: new mongoose.Types.ObjectId(appointmentId),
      callStartTime: callStartTime,
      callRoomId: callRoomId,
      callerId: new mongoose.Types.ObjectId(callerId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
    });
  }
  public async updateVideoCallLog({
    callRoomId,
    callEndTime,
    callStatus,
  }: UpdateVideoCallLogDTO): Promise<VideoCallLog> {
    const videoCallLogData = await videoCallLogModel.findOneAndUpdate(
      { callRoomId: callRoomId },
      { callEndTime: callEndTime, callStatus: callStatus },
      { new: true }
    );
    return videoCallLogData!!;
  }

  public async updateVideoCallDuration({
    callRoomId,
    callDuration,
  }: UpdateVideoCallDurationDTO): Promise<void> {
    await videoCallLogModel.findOneAndUpdate(
      { callRoomId: callRoomId },
      { callDuration: callDuration },
      { new: true }
    );
  }

  public async getTrainerVideoCallLogs(
    trainerId: IdDTO,
    { page, limit, search, fromDate, toDate, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    trainerVideoCallLogList: TrainerVideoCallLog[];
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

    const [totalCount, trainerVideoCallLogList] = await Promise.all([
      videoCallLogModel
        .aggregate([
          { $match: { callerId: new mongoose.Types.ObjectId(trainerId) } },
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
          { $count: "totalCount" },
        ])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      videoCallLogModel
        .aggregate([
          { $match: { callerId: new mongoose.Types.ObjectId(trainerId) } },
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
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);
    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      trainerVideoCallLogList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  public async getUserVideoCallLogs(
    userId: IdDTO,
    { page, limit, search, fromDate, toDate, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    userVideoCallLogList: UserVideoCallLog[];
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

    const [totalCount, userVideoCallLogList] = await Promise.all([
      videoCallLogModel
        .aggregate([
          { $match: { receiverId: new mongoose.Types.ObjectId(userId) } },
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
          { $count: "totalCount" },
        ])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      videoCallLogModel
        .aggregate([
          { $match: { receiverId: new mongoose.Types.ObjectId(userId) } },
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
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);
    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      userVideoCallLogList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }
}
