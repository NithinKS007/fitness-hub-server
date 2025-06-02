import mongoose from "mongoose";
import {
  CreateVideoCallLogDTO,
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
} from "../../../application/dtos/video-call-dtos";
import { PaginationDTO } from "../../../application/dtos/utility-dtos";
import { IVideoCallLogRepository } from "../../../domain/interfaces/IVideoCallLogRepository";
import videoCallLogModel from "../models/videocalllog.model";
import {
  TrainerVideoCallLog,
  UserVideoCallLog,
  VideoCallLog,
} from "../../../domain/entities/video-calllog.entities";
import { GetVideoCallLogQueryDTO } from "../../../application/dtos/query-dtos";

export class VideoCallLogRepository implements IVideoCallLogRepository {
  async createCallLog({
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
  async updateVideoCallLog({
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

  async updateVideoCallDuration({
    callRoomId,
    callDuration,
  }: UpdateVideoCallDurationDTO): Promise<void> {
    await videoCallLogModel.findOneAndUpdate(
      { callRoomId: callRoomId },
      { callDuration: callDuration },
      { new: true }
    );
  }

  async getTrainerVideoCallLogs(
    trainerId: string,
    { page, limit, search, fromDate, toDate, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    trainerVideoCallLogList: TrainerVideoCallLog[];
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

  async getUserVideoCallLogs(
    userId: string,
    { page, limit, search, fromDate, toDate, filters }: GetVideoCallLogQueryDTO
  ): Promise<{
    userVideoCallLogList: UserVideoCallLog[];
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
