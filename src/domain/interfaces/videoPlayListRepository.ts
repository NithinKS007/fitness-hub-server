import { BulkWriteAddVideoPlayListDTO, BulkWriteDeleteVideoPlayListDTO, CreateVideoPlayListDTO } from "../../application/dtos/contentDTOs";
import { IdDTO } from "../../application/dtos/utilityDTOs";
import { VideoPlayList } from "../entities/videoPlayList";

export interface VideoPlayListRepository {
    insertManyVideoPlayList(data:CreateVideoPlayListDTO[]):Promise<VideoPlayList[]>
    getVideosOfTrainerByPlayListId(data:IdDTO):Promise<void>
    bulkWriteAddNewDeleteUnused(addPlayList:BulkWriteAddVideoPlayListDTO[],deletePlayList:BulkWriteDeleteVideoPlayListDTO[]):Promise<void>
}