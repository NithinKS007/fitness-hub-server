import { BulkWriteAddVideoPlayListDTO, BulkWriteDeleteVideoPlayListDTO, CreateVideoPlayListDTO } from "../../application/dtos/contentDTOs";
import { VideoPlayList } from "../entities/videoPlayList";

export interface IVideoPlayListRepository {
    insertManyVideoPlayList(createVideoPlayList:CreateVideoPlayListDTO[]):Promise<VideoPlayList[]>
    bulkWriteAddNewDeleteUnused(addPlayList:BulkWriteAddVideoPlayListDTO[],deletePlayList:BulkWriteDeleteVideoPlayListDTO[]):Promise<void>
}