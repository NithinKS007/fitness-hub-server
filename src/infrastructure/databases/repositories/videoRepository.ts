import mongoose, { mongo } from "mongoose";
import {
  CreatedVideoDTO,
  EditVideo,
  UpdateVideoBlockStatus,
} from "../../../application/dtos/contentDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { Video } from "../../../domain/entities/videoEntity";
import { IVideoRepository } from "../../../domain/interfaces/IVideoRepository";
import videoModel from "../models/videoModel";
import { GetVideoQueryDTO } from "../../../application/dtos/queryDTOs";

export class MonogVideoRepository implements IVideoRepository {
  public async createVideo({
    trainerId,
    title,
    description,
    thumbnail,
    video,
    playLists,
    duration,
  }: CreatedVideoDTO): Promise<Video> {
    const trainerIdObjectId = new mongoose.Types.ObjectId(trainerId);
    const playListsObjectId = playLists.map(
      (playlist) => new mongoose.Types.ObjectId(playlist)
    );
    const createdVideo = await videoModel.create({
      trainerId: trainerIdObjectId,
      title,
      description,
      thumbnail,
      video,
      duration,
      playLists: playListsObjectId,
    });
    return createdVideo.toObject();
  }

  public async updateVideoBlockStatus({
    videoId,
    privacy,
  }: UpdateVideoBlockStatus): Promise<Video | null> {
    return await videoModel.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(videoId) },
      { privacy: privacy },
      { new: true }
    );
  }
  public async getVideosOfTrainerByTrainerId(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO
  ): Promise<{ videoList: Video[]; paginationData: PaginationDTO }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const trainerIdObjectId = new mongoose.Types.ObjectId(trainerId);
    let matchQuery: any = {};

    if (search) {
      matchQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions: any = [];
      if (filters.includes("Active")) conditions.push({ privacy: false });
      if (filters.includes("Inactive")) conditions.push({ privacy: true });
      if (conditions.length > 0) matchQuery.$and = conditions;
    }

    if (fromDate || toDate) {
      matchQuery.createdAt = {};
      if (fromDate) {
        matchQuery.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        matchQuery.createdAt.$lte = new Date(toDate);
      }
    }

    const totalCount = await videoModel.countDocuments({
      trainerId: trainerIdObjectId,
      ...matchQuery,
    });
    const videoList = await videoModel
      .find({ trainerId: trainerIdObjectId, ...matchQuery })
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .lean();

    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      videoList,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  public async getVideoById(videoId: IdDTO): Promise<Video | null> {
    return await videoModel.findOne({
      _id: new mongoose.Types.ObjectId(videoId),
    });
  }

  public async editVideo({
    _id,
    title,
    description,
    duration,
    thumbnail,
    video,
  }: EditVideo): Promise<Video | null> {
    return await videoModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(_id),
      {
        title: title,
        description: description,
        duration: duration,
        thumbnail: thumbnail,
        video: video,
      }
    );
  }
}
