import mongoose, { Model } from "mongoose";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IVideoRepository } from "@domain/interfaces/IVideoRepository";
import { GetVideoQueryDTO } from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { IVideo } from "@domain/entities/video.entity";
import VideoModel from "../models/video.model";
import { VideoWithPlayLists } from "@application/dtos/video-dtos";

export class VideoRepository
  extends BaseRepository<IVideo>
  implements IVideoRepository
{
  constructor(model: Model<IVideo> = VideoModel) {
    super(model);
  }

  async findOne(query: Partial<IVideo>): Promise<IVideo | null> {
    const { title, _id } = query;

    const queryObject: any = {};

    if (title) {
      queryObject.title = title;
    }

    if (_id) {
      queryObject._id = { $ne: this.parseId(_id.cast.toString()) };
    }

    return await this.model.findOne(queryObject);
  }

  async getVideos(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetVideoQueryDTO,
    videoPrivacy?: boolean,
    playlistPrivacy?: boolean
  ): Promise<{
    videoList: VideoWithPlayLists[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: any = {
      trainerId: this.parseId(trainerId),
    };

    if (videoPrivacy !== undefined) {
      matchQuery.privacy = videoPrivacy;
    }

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
      ...(playlistPrivacy !== undefined
        ? [
            {
              $match: {
                "playLists.privacy": playlistPrivacy,
              },
            },
          ]
        : []),
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

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });
    return {
      videoList,
      paginationData,
    };
  }
}
