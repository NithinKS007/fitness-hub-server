import mongoose from "mongoose";
import {
  CreatePlayListDTO,
  UpdatePlayListBlockStatus,
} from "../../../application/dtos/contentDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { IPlayListRepository } from "../../../domain/interfaces/IPlayListRepository";
import playlistModel from "../models/playListModel";
import { Playlist } from "../../../domain/entities/playListEntity";
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

  public async getAllPlayListsByTrainerId(
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

  public async updateManyVideoCount(playListIds: IdDTO[]): Promise<void> {
    await playlistModel.updateMany(
      { _id: { $in: playListIds } },
      { $set: { videoCount: playListIds.length } }
    );
  }

  public async getFullPlayListsOfTrainer(
    trainerId: IdDTO
  ): Promise<Playlist[]> {
    return await playlistModel.find({ trainerId: trainerId });
  }
}
