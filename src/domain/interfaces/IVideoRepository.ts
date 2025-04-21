import { CreatedVideoDTO, EditVideo, UpdateVideoBlockStatus } from "../../application/dtos/contentDTOs";
import { GetVideoQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { Video, VideoWithPlayLists } from "../entities/videoEntity";

export interface IVideoRepository {
    createVideo(createVideo:CreatedVideoDTO):Promise<Video>
    getTrainerVideos(trainerId:IdDTO,data:GetVideoQueryDTO):Promise<{videoList:VideoWithPlayLists[],  paginationData:PaginationDTO}>
    getVideoById(videoId:IdDTO):Promise<Video | null>
    updateVideoBlockStatus(updateVideoBlockStatus:UpdateVideoBlockStatus):Promise<Video| null>
    editVideo(editVideo:EditVideo):Promise<Video | null>
}