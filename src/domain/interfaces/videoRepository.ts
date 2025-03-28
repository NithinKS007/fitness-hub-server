import { CreatedVideoDTO } from "../../application/dtos/contentDTOs";
import { IdDTO } from "../../application/dtos/utilityDTOs";
import { Video } from "../entities/videoEntity";

export interface videoRepository {
    createVideo(data:CreatedVideoDTO):Promise<Video>
    getVideosOfTrainerByTrainerId(data:IdDTO):Promise<Video[]>
    getVideoById(data:IdDTO):Promise<Video | null>
}