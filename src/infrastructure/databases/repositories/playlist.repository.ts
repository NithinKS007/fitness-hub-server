import { Model } from "mongoose";
import { PaginationDTO } from "../../../application/dtos/utility-dtos";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";
import PlaylistModel, { IPlayList } from "../models/playlist.model";
import {
  NumberOfVideoPerPlayList,
  Playlist,
} from "../../../domain/entities/playlist.entities";
import { GetPlayListsQueryDTO } from "../../../application/dtos/query-dtos";
import { BaseRepository } from "./base.repository";

export class PlayListRepository
  extends BaseRepository<IPlayList>
  implements IPlayListRepository
{
  constructor(model: Model<IPlayList> = PlaylistModel) {
    super(model);
  }

  async getPlaylists(
    trainerId: string,
    { page, limit, fromDate, toDate, search, filters }: GetPlayListsQueryDTO
  ): Promise<{ playList: Playlist[]; paginationData: PaginationDTO }> {
    const pageNumber = page || 1;
    const limitNumber = limit || 10;
    const skip = (pageNumber - 1) * limitNumber;

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

    const totalPages = Math.ceil(totalCount / limitNumber);

    return {
      playList: trainerPlaylists,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  async getNumberOfVideosPerPlaylist(
    playListIds: string[]
  ): Promise<NumberOfVideoPerPlayList[]> {
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
  async updateManyVideoCount(
    numberOfVideosPerPlaylist: NumberOfVideoPerPlayList[]
  ): Promise<void> {
    const bulkOps = numberOfVideosPerPlaylist.map((item) => ({
      updateOne: {
        filter: { _id: item.playListId },
        update: { $set: { videoCount: item.videoCount } },
      },
    }));

    if (bulkOps.length > 0) {
      await this.model.bulkWrite(bulkOps);
    }
  }

  async getallPlaylists(trainerId: string): Promise<Playlist[]> {
    return await this.model.find({ trainerId: trainerId });
  }
}
