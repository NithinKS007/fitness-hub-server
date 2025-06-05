import mongoose, { Model } from "mongoose";
import { PaginationDTO } from "../../../application/dtos/utility-dtos";
import { VideoWithPlayLists } from "../../../domain/entities/video.entities";
import { IVideoRepository } from "../../../domain/interfaces/IVideoRepository";
import VideoModel, { IVideo } from "../models/video.model";
import { GetVideoQueryDTO } from "../../../application/dtos/query-dtos";
import { BaseRepository } from "./base.repository";

export class VideoRepository
  extends BaseRepository<IVideo>
  implements IVideoRepository
{
  constructor(model: Model<IVideo> = VideoModel) {
    super(model);
  }

  async getVideos(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const trainerObjectId = this.parseId(trainerId);
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
        matchQuery.createdAt.$gte = fromDate;
      }
      if (toDate) {
        matchQuery.createdAt.$lte = toDate;
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
        .map((id) => this.parseId(id)) || [];

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
      this.model
        .aggregate([...basePipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
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

  async getPublicVideos(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }> {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const trainerObjectId = this.parseId(trainerId);
    let matchQuery: any = { trainerId: trainerObjectId, privacy: false };

    if (search) {
      matchQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (fromDate || toDate) {
      matchQuery.createdAt = {};
      if (fromDate) {
        matchQuery.createdAt.$gte = fromDate;
      }
      if (toDate) {
        matchQuery.createdAt.$lte = toDate;
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
        .map((id) => this.parseId(id)) || [];

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
      this.model
        .aggregate([...basePipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
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
}
