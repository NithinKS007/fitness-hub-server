import mongoose from "mongoose";
import {
    CreatePlayList,
    IdDTO,
} from "../../../application/dtos";
import { PlayListRepository } from "../../../domain/interfaces/playListRepository";
import playlistModel from "../models/videoPlayListModel";
import { Playlist } from "../../../domain/entities/playListEntity";

export class MongoPlayListRepository implements PlayListRepository {
    public async createPlayList( data: CreatePlayList ): Promise<Playlist> {
    const trainerId = new mongoose.Types.ObjectId(data.trainerId);
    const PlayList = await playlistModel.create({...data,trainerId:trainerId});
    return PlayList.toObject();
  }

    public async getAllPlayListsByTrainerId(data:IdDTO):Promise<Playlist[]>{

        const trainerId = new mongoose.Types.ObjectId(data)
        const trainerPlaylists = await playlistModel.find({trainerId:trainerId}).lean()
        return trainerPlaylists
    }
}