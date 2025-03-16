import { CreatedVideoDTO, IdDTO } from "../../application/dtos";
import { Video } from "../entities/videoEntity";

export interface videoRepository {
    createVideo(data:CreatedVideoDTO):Promise<Video>
    getVideosOfTrainerByTrainerId(data:IdDTO):Promise<Video[]>
}