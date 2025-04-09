import mongoose from "mongoose";
import { BulkWriteAddVideoPlayListDTO, BulkWriteDeleteVideoPlayListDTO, CreateVideoPlayListDTO } from "../../../application/dtos/contentDTOs";
import { IdDTO } from "../../../application/dtos/utilityDTOs";
import { VideoPlayList } from "../../../domain/entities/videoPlayList";
import { VideoPlayListRepository } from "../../../domain/interfaces/videoPlayListRepository";
import videoPlayListModel from "../models/videoPlayListModel";

export class MonogVideoPlayListRepository implements VideoPlayListRepository { 
    public async insertManyVideoPlayList(data:CreateVideoPlayListDTO[]): Promise<VideoPlayList[]> {
        return await videoPlayListModel.insertMany(data)
    }

    public async bulkWriteAddNewDeleteUnused(addPlayList:BulkWriteAddVideoPlayListDTO[],deletePlayList:BulkWriteDeleteVideoPlayListDTO[]): Promise<void> {
        
        await videoPlayListModel.bulkWrite(
            [
                {
                    deleteMany: {
                        filter: { videoId: { $in: deletePlayList } }
                    }
                },
                ...addPlayList.map(playList => ({
                    insertOne: { document: playList }
                }))
            ]
         )
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
        return result
    }
    
}