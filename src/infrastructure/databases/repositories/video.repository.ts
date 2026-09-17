import mongoose, { Model, FilterQuery } from "mongoose";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { IVideoRepository } from "@domain/interfaces/IVideoRepository";
import { GetVideosDTO } from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { Video } from "@domain/entities/video.entity";
import VideoModel, { IVideo } from "../models/video.model";
import { MongoHelper } from "../utils/mongo-helper";
import { VideoMapper, VideoUILayer } from "@infrastructure/mappers/video.mapper";

export class VideoRepository
  extends BaseRepository<IVideo, Video>
  implements IVideoRepository
{
  constructor(
    model: Model<IVideo> = VideoModel,
    private videoMapper: VideoMapper = new VideoMapper(),
    private utility: MongoHelper = new MongoHelper()
  ) {
    super(model);
  }

  async findOne(query: Partial<Video>): Promise<Video | null> {
    const { title, id } = query;

    const queryObject: FilterQuery<Video> = {};

    if (title) {
      queryObject.title = title;
    }

    if (id) {
      queryObject._id = { $ne: this.parseId(id) };
    }

    const result = await this.model.findOne(queryObject);
    return result ? this.toDomain(result) : null;
  }

  async getVideos(dtos: GetVideosDTO): Promise<PagedResponse<VideoUILayer>> {
    const { trainerId, page, limit, fromDate, toDate, search, filters } = dtos;
    const { playlistPrivacy, videoPrivacy } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: any = {
      trainerId: this.parseId(trainerId),
      ...this.utility.dateFilter({ fromDate, toDate }, "createdAt"),
      ...this.utility.search({ search }, ["title", "description"]),
      ...(videoPrivacy !== undefined ? { privacy: videoPrivacy } : {}),
    };

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions: { privacy: boolean }[] = [];

      for (const filter of filters) {
        switch (filter) {
          case "Active":
            conditions.push({ privacy: false });
            break;
          case "Inactive":
            conditions.push({ privacy: true });
            break;
          default:
            break;
        }
      }

      if (conditions.length > 0) matchQuery.$and = conditions;
    }

    const basePipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "videoplaylists",
          localField: "_id",
          foreignField: "videoId",
          as: "videoplaylists",
        },
      },
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

    const mappedData = videoList.map((data) => this.videoMapper.map(data));
    return {
      data: mappedData,
      pagination: paginationData,
    };
  }
}
