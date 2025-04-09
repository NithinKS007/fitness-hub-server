import mongoose from "mongoose";
import { CreatePlayListDTO, UpdatePlayListBlockStatus } from "../../../application/dtos/contentDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { PlayListRepository } from "../../../domain/interfaces/playListRepository";
import playlistModel from "../models/playListModel";
import { Playlist } from "../../../domain/entities/playListEntity";
import { GetPlayListsQueryDTO } from "../../../application/dtos/queryDTOs";

export class MongoPlayListRepository implements PlayListRepository {
    public async createPlayList( data: CreatePlayListDTO ): Promise<Playlist> {
    const trainerId = new mongoose.Types.ObjectId(data.trainerId);
    const PlayList = await playlistModel.create({...data,trainerId:trainerId});
    return PlayList.toObject();
  }

  public async updatePlayListBlockStatus(data: UpdatePlayListBlockStatus): Promise<Playlist | null> {
      const {playListId,privacy} = data
      return await playlistModel.findByIdAndUpdate({_id:new mongoose.Types.ObjectId(playListId)},{privacy:privacy},{new:true})
  }

    public async getAllPlayListsByTrainerId(trainerId:IdDTO,data:GetPlayListsQueryDTO):Promise<{playList:Playlist[],  paginationData:PaginationDTO}>{

        const { page, limit, search, filters ,fromDate,toDate} = data;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        let matchQuery: any = {};
        if(data){
            if(search){
                matchQuery.$or = [
                    { title: { $regex: search, $options: "i" } },
                  ];
            }

            if (filters && filters.length > 0 && !filters.includes("All")) {
                const conditions: any = [];
                if (filters.includes("Active")) conditions.push({ privacy: false });
                if (filters.includes("Inactive")) conditions.push({ privacy: true });
                if (conditions.length > 0) matchQuery.$and = conditions;
            }
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
        const totalCount = await playlistModel.countDocuments({trainerId:new mongoose.Types.ObjectId(trainerId),...matchQuery})
        const trainerPlaylists = await playlistModel.find({trainerId:new mongoose.Types.ObjectId(trainerId),...matchQuery}) .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 })
        .lean();

        const totalPages = Math.ceil(totalCount / limitNumber);

       return {
            playList:trainerPlaylists,
            paginationData: {
              currentPage: pageNumber ,
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
  
    public async getFullPlayListsOfTrainer(trainerId: IdDTO): Promise<Playlist[]> {  
        return await playlistModel.find({trainerId:trainerId})
    }
}