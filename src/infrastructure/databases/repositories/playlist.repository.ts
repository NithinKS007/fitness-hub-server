import { Model } from "mongoose";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { GetPlayListsQueryDTO } from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { PlayList } from "@domain/entities/playlist.entity";
import PlayListModel, { IPlayList } from "../models/playlist.model";
import { VideoPerPlayList } from "@application/dtos/playlist-dtos";

export class PlayListRepository
  extends BaseRepository<IPlayList, PlayList>
  implements IPlayListRepository
{
  constructor(model: Model<IPlayList> = PlayListModel) {
    super(model);
  }

  async findOne(query: Partial<PlayList>): Promise<PlayList | null> {
    const { title, _id } = query;

    const queryObject: any = {};

    if (title) {
      queryObject.title = title;
    }

    if (_id) {
      queryObject._id = { $ne: this.parseId(String(_id)) };
    }

    const result = await this.model.findOne(queryObject);
    return result ? this.toDomain(result) : null;
  }

  async getPlaylists(
    { trainerId, page, limit, fromDate, toDate, search, filters }: GetPlayListsQueryDTO
  ): Promise<{ playList: PlayList[]; paginationData: PaginationDTO }> {
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
    const [totalCount, playlists] = await Promise.all([
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
    ]);

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });
    const toDomainList = playlists.map((p) => this.toDomain(p));
    return {
      playList: toDomainList,
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

  async updateVideosCount(VideoPerPlayList: VideoPerPlayList[]): Promise<void> {
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
  ): Promise<PlayList[]> {
    const query: any = { trainerId };
    if (privacy !== undefined) {
      query.privacy = privacy;
    }
    const result = await this.model.find(query);
    return result.map((re) => this.toDomain(re));
  }
}
