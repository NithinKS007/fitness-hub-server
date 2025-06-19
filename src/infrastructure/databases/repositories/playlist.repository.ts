import { Model } from "mongoose";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { GetPlayListsQueryDTO } from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { IPlayList } from "@domain/entities/playlist.entity";
import PlayListModel from "../models/playlist.model";
import { VideoPerPlayList } from "@application/dtos/playlist-dtos";

export class PlayListRepository
  extends BaseRepository<IPlayList>
  implements IPlayListRepository
{
  constructor(model: Model<IPlayList> = PlayListModel) {
    super(model);
  }

  async findOne(query: Partial<IPlayList>): Promise<IPlayList | null> {
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

  async getPlaylists(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetPlayListsQueryDTO
  ): Promise<{ playList: IPlayList[]; paginationData: PaginationDTO }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    let matchQuery: any = {};

    if (search) {
      matchQuery.$or = [{ title: { $regex: search, $options: "i" } }];
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
        matchQuery.createdAt.$gte = fromDate;
      }
      if (toDate) {
        matchQuery.createdAt.$lte = toDate;
      }
    }
    const [totalCount, trainerPlaylists] = await Promise.all([
      this.model.countDocuments({
        trainerId: this.parseId(trainerId),
        ...matchQuery,
      }),
      this.model
        .find({
          trainerId: this.parseId(trainerId),
          ...matchQuery,
        })
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    return {
      playList: trainerPlaylists,
      paginationData,
    };
  }

  async getPlaylistCounts(playListIds: string[]): Promise<VideoPerPlayList[]> {
    const result = await this.model.aggregate([
      {
        $match: {
          _id: {
            $in: playListIds.map((id) => this.parseId(id)),
          },
        },
      },
      {
        $lookup: {
          from: "videoplaylists",
          localField: "_id",
          foreignField: "playListId",
          as: "videoLinks",
        },
      },
      {
        $project: {
          playListId: "$_id",
          videoCount: { $size: "$videoLinks" },
        },
      },
    ]);

    return result;
  }

  async updateVideosCount(
    VideoPerPlayList: VideoPerPlayList[]
  ): Promise<void> {
    await Promise.all(
      VideoPerPlayList.map((item) =>
        this.model.updateOne(
          { _id: item.playListId }, 
          { $set: { videoCount: item.videoCount } } 
        )
      )
    );
  }

  async getallPlaylists(
    trainerId: string,
    privacy: boolean
  ): Promise<IPlayList[]> {
    const query: any = { trainerId };
    if (privacy !== undefined) {
      query.privacy = privacy;
    }
    return await this.model.find(query);
  }
}
