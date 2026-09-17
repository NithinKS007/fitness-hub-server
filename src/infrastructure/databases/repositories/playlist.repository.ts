import { Model } from "mongoose";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IPlayListRepository } from "@domain/interfaces/IPlayListRepository";
import { GetPlayListsDTO } from "@application/dtos/query-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { PlayList } from "@domain/entities/playlist.entity";
import PlayListModel, { IPlayList } from "../models/playlist.model";
import { VideoPerPlayList } from "@application/dtos/playlist-dtos";
import { MongoHelper } from "../utils/mongo-helper";

export class PlayListRepository
  extends BaseRepository<IPlayList, PlayList>
  implements IPlayListRepository
{
  constructor(
    model: Model<IPlayList> = PlayListModel,
    private utility: MongoHelper = new MongoHelper()
  ) {
    super(model);
  }

  async findOne(query: Partial<PlayList>): Promise<PlayList | null> {
    const { title, id } = query;

    const queryObject: any = {};

    if (title) {
      queryObject.title = title;
    }

    if (id) {
      queryObject._id = { $ne: this.parseId(id) };
    }

    const result = await this.model.findOne(queryObject);
    return result ? this.toDomain(result) : null;
  }

  async getPlaylists(dtos: GetPlayListsDTO): Promise<{
    playList: PlayList[];
    paginationData: PaginationDTO;
  }> {
    const { trainerId, page, limit, fromDate, toDate, search, filters } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    let matchQuery: any = {
      ...this.utility.dateFilter({ fromDate, toDate }, "createdAt"),
      ...this.utility.search({ search }, ["title"]),
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
        .sort({ createdAt: -1 }),
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

  async getallPlaylists(trainerId: string, privacy: boolean): Promise<PlayList[]> {
    const query = {
      trainerId,
      ...(privacy !== undefined ? { privacy: privacy } : {}),
    };
    const result = await this.model.find(query);
    return result.map((result) => this.toDomain(result));
  }
}
