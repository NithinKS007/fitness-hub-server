import mongoose from "mongoose";
import { CreateVideoPlayListDTO } from "../../../application/dtos/contentDTOs";
import { IdDTO } from "../../../application/dtos/utilityDTOs";
import { VideoPlayList } from "../../../domain/entities/videoPlayList";
import { VideoPlayListRepository } from "../../../domain/interfaces/videoPlayListRepository";
import videoPlayListModel from "../models/videoPlayListModel";

export class MonogVideoPlayListRepository implements VideoPlayListRepository { 
    public async insertManyVideoPlayList(data:CreateVideoPlayListDTO[]): Promise<VideoPlayList[]> {
        return await videoPlayListModel.insertMany(data)
    }
    public async getVideosOfTrainerByPlayListId(data: IdDTO): Promise<any> {
        const playListId = new mongoose.Types.ObjectId(data);
        const result = await videoPlayListModel.aggregate([
            {
                $match: { playListId: playListId }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "videoId",
                    foreignField: "_id",
                    as: "videoData"
                }
            },
            {$unwind:"$videoData"},
            
        ]);

        console.log("hello my result",result)
        return result
    }
    
}