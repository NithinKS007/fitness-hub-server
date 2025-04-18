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
import videoPlayListModel from "../models/videoPlayListModel";

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

    const trainerObjectId = new mongoose.Types.ObjectId(trainerId);
    let matchQuery: any = { trainerId: trainerObjectId };

    if (search) {
      matchQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
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

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions: any = [];
      if (filters.includes("Active")) conditions.push({ privacy: false });
      if (filters.includes("Inactive")) conditions.push({ privacy: true });
      if (conditions.length > 0) matchQuery.$and = conditions;
    }

    const playlistIds =
      filters
        ?.filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id)) || [];
    if (playlistIds.length > 0) {
      const videoIds = await videoPlayListModel
        .find({ playListId: { $in: playlistIds } })
        .distinct("videoId")
        .lean();
      if (videoIds.length === 0) {
        return {
          videoList: [],
          paginationData: { currentPage: pageNumber, totalPages: 0 },
        };
      }
      matchQuery._id = {
        $in: videoIds.map((id) => new mongoose.Types.ObjectId(id.toString())),
      };
    }

    const basePipeline: any[] = [
      { $match: matchQuery },
      {
        $project: {
          _id: 1,
          trainerId: 1,
          title: 1,
          description: 1,
          duration: 1,
          thumbnail: 1,
          video: 1,
          privacy: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];
    const [totalCount, videoList] = await Promise.all([
      videoModel
        .aggregate([...basePipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      videoModel
        .aggregate(basePipeline)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

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
