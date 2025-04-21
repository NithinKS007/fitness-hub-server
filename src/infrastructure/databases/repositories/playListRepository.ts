import mongoose, { ObjectId } from "mongoose";
import {
  CreatePlayListDTO,
  EditPlayList,
  UpdatePlayListBlockStatus,
} from "../../../application/dtos/contentDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";
import playlistModel from "../models/playListModel";
import {
  NumberOfVideoPerPlayList,
  Playlist,
} from "../../../domain/entities/playListEntity";
import { GetPlayListsQueryDTO } from "../../../application/dtos/queryDTOs";

export class MongoPlayListRepository implements IPlayListRepository {
  public async createPlayList({
    trainerId,
    ...rest
  }: CreatePlayListDTO): Promise<Playlist> {
    const PlayList = await playlistModel.create({
      ...rest,
      trainerId: new mongoose.Types.ObjectId(trainerId),
    });
    return PlayList.toObject();
  }

  public async updatePlayListBlockStatus({
    playListId,
    privacy,
  }: UpdatePlayListBlockStatus): Promise<Playlist | null> {
    return await playlistModel.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(playListId) },
      { privacy: privacy },
      { new: true }
    );
  }
  public async editPlayList({
    playListId,
    title,
  }: EditPlayList): Promise<Playlist | null> {
    return await playlistModel.findOneAndUpdate(
      new mongoose.Types.ObjectId(playListId),
      { title: title },
      { new: true }
    );
  }

  public async getTrainerPlaylists(
    trainerId: IdDTO,
    { page, limit, fromDate, toDate, search, filters }: GetPlayListsQueryDTO
  ): Promise<{ playList: Playlist[]; paginationData: PaginationDTO }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
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
        matchQuery.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        matchQuery.createdAt.$lte = new Date(toDate);
      }
    }
    const totalCount = await playlistModel.countDocuments({
      trainerId: new mongoose.Types.ObjectId(trainerId),
      ...matchQuery,
    });
    const trainerPlaylists = await playlistModel
      .find({
        trainerId: new mongoose.Types.ObjectId(trainerId),
        ...matchQuery,
      })
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .lean();

    const totalPages = Math.ceil(totalCount / limitNumber);

    return {
      playList: trainerPlaylists,
      paginationData: {
        currentPage: pageNumber,
        totalPages: totalPages,
      },
    };
  }

  public async getNumberOfVideosPerPlaylist(
    playListIds: IdDTO[]
  ): Promise<NumberOfVideoPerPlayList[]> {
    const result = await playlistModel.aggregate([
      {
        $match: {
          _id: {
            $in: playListIds.map((id) => new mongoose.Types.ObjectId(id)),
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
  public async updateManyVideoCount(
    numberOfVideosPerPlaylist: NumberOfVideoPerPlayList[]
  ): Promise<void> {
    const bulkOps = numberOfVideosPerPlaylist.map((item) => ({
      updateOne: {
        filter: { _id: item.playListId },
        update: { $set: { videoCount: item.videoCount } },
      },
    }));

    if (bulkOps.length > 0) {
      await playlistModel.bulkWrite(bulkOps);
    }
  }

  public async getallTrainerPlaylists(trainerId: IdDTO): Promise<Playlist[]> {
    return await playlistModel.find({ trainerId: trainerId });
  }
}
