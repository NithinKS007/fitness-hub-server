import { CreatedVideoDTO,CreatePlayListDTO } from "../dtos/contentDTOs";
import { IdDTO } from "../dtos/utilityDTOs";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { Playlist } from "../../domain/entities/playListEntity";
import { Video } from "../../domain/entities/videoEntity";
import { PlayListRepository } from "../../domain/interfaces/playListRepository";
import { videoRepository } from "../../domain/interfaces/videoRepository";
import { VideoPlayListRepository } from "../../domain/interfaces/videoPlayListRepository";


export class ContentManagementUseCase {
  constructor(private playListRepository:PlayListRepository ,private videoRepository:videoRepository, private videoPlayListRepository :VideoPlayListRepository) {}

  public async createPlayList(data:CreatePlayListDTO): Promise<Playlist> {
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
    const createdVideo =  await this.videoRepository.createVideo(data)

    if(createdVideo && data.playLists && data.playLists.length > 0){

       const videoPlayListDocs = data.playLists.map((list)=>({
           videoId:createdVideo._id.toString(),
           playListId:list,
       }))

      await this.playListRepository.updateManyVideoCount(data.playLists)
      await this.videoPlayListRepository.insertManyVideoPlayList(videoPlayListDocs)
    }
    return createdVideo
  }

  public async getVideosByTrainerId(data:IdDTO):Promise<Video[]>{
    if(!data){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.videoRepository.getVideosOfTrainerByTrainerId(data)
  }

  public async getVideosByPlayListId(data:IdDTO):Promise<any>{
    if(!data){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.videoPlayListRepository.getVideosOfTrainerByPlayListId(data)
  }

  public async  getVideoById(data:IdDTO):Promise<any>{
    if(!data){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
     return await this.videoRepository.getVideoById(data)

  }

}
