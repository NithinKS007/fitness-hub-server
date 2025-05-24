import mongoose from "mongoose";
import {
  CreateVideoDTO,
  EditVideoDTO,
  UpdateVideoPrivacyDTO,
} from "../../../application/dtos/video-dtos";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utility-dtos";
import { Video, VideoWithPlayLists } from "../../../domain/entities/video";
import { IVideoRepository } from "../../../domain/interfaces/IVideoRepository";
import videoModel from "../models/videoModel";
import { GetVideoQueryDTO } from "../../../application/dtos/query-dtos";

export class MonogVideoRepository implements IVideoRepository {
  public async createVideo({
    trainerId,
    title,
    description,
    thumbnail,
    video,
    playLists,
    duration,
  }: CreateVideoDTO): Promise<Video> {
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

  public async updateVideoPrivacy({
    videoId,
    privacy,
  }: UpdateVideoPrivacyDTO): Promise<Video | null> {
    return await videoModel.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(videoId) },
      { privacy: privacy },
      { new: true }
    );
  }
  public async getVideos(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }> {
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

    const basePipeline: any[] = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "videoplaylists",
          localField: "_id",
          foreignField: "videoId",
          as: "videoplaylists",
        },
      },
      ...(playlistIds.length > 0
        ? [
            {
              $match: {
                "videoplaylists.playListId": { $in: playlistIds },
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: "playlists",
          localField: "videoplaylists.playListId",
          foreignField: "_id",
          as: "playLists",
        },
      },
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
          playLists: 1,
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

  public async getPublicVideos(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const trainerObjectId = new mongoose.Types.ObjectId(trainerId);
    let matchQuery: any = { trainerId: trainerObjectId,privacy:false };

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

    const basePipeline: any[] = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "videoplaylists",
          localField: "_id",
          foreignField: "videoId",
          as: "videoplaylists",
        },
      },
      ...(playlistIds.length > 0
        ? [
            {
              $match: {
                "videoplaylists.playListId": { $in: playlistIds },
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: "playlists",
          localField: "videoplaylists.playListId",
          foreignField: "_id",
          as: "playLists",
        },
      },
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
          playLists: 1,
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
  }: EditVideoDTO): Promise<Video | null> {
    return await videoModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(_id),
      {
        title: title,
        description: description,
        duration: duration,
        thumbnail: thumbnail,
        video: video,
      },
      { new: true }
    );
  }
}
