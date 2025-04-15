import { BulkWriteAddVideoPlayListDTO, BulkWriteDeleteVideoPlayListDTO, CreateVideoPlayListDTO } from "../../../application/dtos/contentDTOs";
import { VideoPlayList } from "../../../domain/entities/videoPlayList";
import { IVideoPlayListRepository } from "../../../domain/interfaces/IVideoPlayListRepository";
import videoPlayListModel from "../models/videoPlayListModel";

export class MonogVideoPlayListRepository implements IVideoPlayListRepository { 
    public async insertManyVideoPlayList(createVideoPlayList:CreateVideoPlayListDTO[]): Promise<VideoPlayList[]> {
        return await videoPlayListModel.insertMany(createVideoPlayList)
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
    
}