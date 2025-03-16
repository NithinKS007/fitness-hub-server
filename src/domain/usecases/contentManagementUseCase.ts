import { CreatedVideoDTO, CreatePlayList, IdDTO } from "../../application/dtos";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { Playlist } from "../entities/playListEntity";
import { Video } from "../entities/videoEntity";
import { PlayListRepository } from "../interfaces/playListRepository";
import { videoRepository } from "../interfaces/videoRepository";


export class ContentManagementUseCase {
  constructor(private playListRepository:PlayListRepository ,private videoRepository:videoRepository) {}

  public async createPlayList(data:CreatePlayList): Promise<Playlist> {
    if(!data){
        throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.playListRepository.createPlayList(data)
  }
  public async getPlayListsOfTrainer(data:IdDTO): Promise<Playlist[]> {
    if(!data){
        throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.playListRepository.getAllPlayListsByTrainerId(data)
  }

  public async createdVideo(data:CreatedVideoDTO):Promise<Video>{
    if(!data){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.videoRepository.createVideo(data)
  }

  public async getVideosOfTrainerByTrainerId(data:IdDTO):Promise<Video[]>{
    if(!data){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.videoRepository.getVideosOfTrainerByTrainerId(data)
  }

}
