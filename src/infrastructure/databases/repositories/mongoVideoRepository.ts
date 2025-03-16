import mongoose from "mongoose";
import { CreatedVideoDTO, IdDTO } from "../../../application/dtos";
import { Video } from "../../../domain/entities/videoEntity";
import { videoRepository } from "../../../domain/interfaces/videoRepository";
import videoModel from "../models/videoModel";

export class MonogVideoRepository implements videoRepository { 
    public async createVideo(data: CreatedVideoDTO): Promise<Video> {
        
     const { trainerId, title, description, thumbnail, video, playLists,duration } = data
     const trainerIdObjectId = new mongoose.Types.ObjectId(trainerId);
     const playListsObjectId = playLists.map((playlist) => new mongoose.Types.ObjectId(playlist));
     const createdVideo = await videoModel.create({
        trainerId: trainerIdObjectId,
        title,
        description,
        thumbnail,
        video,
        duration,
        playLists: playListsObjectId,
    });
    return createdVideo.toObject();
    }

    public async getVideosOfTrainerByTrainerId(data:IdDTO):Promise<Video[]>{
        return await videoModel.find({trainerId:data})
    }
}