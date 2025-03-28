import mongoose from "mongoose";
import { CreatePlayListDTO } from "../../../application/dtos/contentDTOs";
import { IdDTO } from "../../../application/dtos/utilityDTOs";
import { PlayListRepository } from "../../../domain/interfaces/playListRepository";
import playlistModel from "../models/playListModel";
import { Playlist } from "../../../domain/entities/playListEntity";

export class MongoPlayListRepository implements PlayListRepository {
    public async createPlayList( data: CreatePlayListDTO ): Promise<Playlist> {
    const trainerId = new mongoose.Types.ObjectId(data.trainerId);
    const PlayList = await playlistModel.create({...data,trainerId:trainerId});
    return PlayList.toObject();
  }

    public async getAllPlayListsByTrainerId(data:IdDTO):Promise<Playlist[]>{

        console.log("id for getting playlists",data)
        const trainerId = new mongoose.Types.ObjectId(data)
        const trainerPlaylists = await playlistModel.find({trainerId:trainerId}).lean()
        return trainerPlaylists
    }

    public async updateManyVideoCount(data: IdDTO[]): Promise<void> {
        await playlistModel.updateMany(
            { _id: { $in: data } },
            { $inc: { videoCount: 1 } }
        ).lean();
    }
  
}