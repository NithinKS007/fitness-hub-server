import { CreatedVideoDTO, EditVideo, UpdateVideoBlockStatus } from "../../application/dtos/contentDTOs";
import { GetVideoQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { Video } from "../entities/videoEntity";

export interface videoRepository {
    createVideo(data:CreatedVideoDTO):Promise<Video>
    getVideosOfTrainerByTrainerId(trainerId:IdDTO,data:GetVideoQueryDTO):Promise<{videoList:Video[],  paginationData:PaginationDTO}>
    getVideoById(data:IdDTO):Promise<Video | null>
    updateVideoBlockStatus(data:UpdateVideoBlockStatus):Promise<Video| null>
    editVideo(data:EditVideo):Promise<Video | null>
}