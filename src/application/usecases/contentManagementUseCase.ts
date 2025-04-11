import { CreatedVideoDTO,CreatePlayListDTO, EditVideo, UpdatePlayListBlockStatus, UpdateVideoBlockStatus } from "../dtos/contentDTOs";
import { IdDTO, PaginationDTO } from "../dtos/utilityDTOs";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { Playlist } from "../../domain/entities/playListEntity";
import { Video } from "../../domain/entities/videoEntity";
import { PlayListRepository } from "../../domain/interfaces/playListRepository";
import { videoRepository } from "../../domain/interfaces/videoRepository";
import { VideoPlayListRepository } from "../../domain/interfaces/videoPlayListRepository";
import { GetPlayListsQueryDTO, GetVideoQueryDTO } from "../dtos/queryDTOs";

export class ContentManagementUseCase {
  constructor(private playListRepository:PlayListRepository ,private videoRepository:videoRepository, private videoPlayListRepository :VideoPlayListRepository) {}

  public async createPlayList(data:CreatePlayListDTO): Promise<Playlist> {
    if(!data){
        throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    return await this.playListRepository.createPlayList(data)
  }
  public async getPlayListsOfTrainer(trainerId:IdDTO,data:GetPlayListsQueryDTO): Promise<{playList:Playlist[],  paginationData:PaginationDTO}> {
    if(!trainerId){
        throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    const {playList,paginationData} =  await this.playListRepository.getAllPlayListsByTrainerId(trainerId,data)

    return {playList,paginationData}
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

  public async getVideosByTrainerId(trainerId:IdDTO,data:GetVideoQueryDTO):Promise<{videoList:Video[],  paginationData:PaginationDTO}>{
    if(!trainerId){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    const{videoList,paginationData} =  await this.videoRepository.getVideosOfTrainerByTrainerId(trainerId,data)
    return {videoList,paginationData}
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

  public async updateVideoBlockStatus(data:UpdateVideoBlockStatus):Promise<Video>{

    if(!data){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    const updatedVideoData =  await this.videoRepository.updateVideoBlockStatus(data)

    if(!updatedVideoData){
      throw new validationError(HttpStatusMessages.FailedToUpdateBlockStatus)
    }
    return updatedVideoData
  }

  public async updatePlayListBlockStatus(data:UpdatePlayListBlockStatus):Promise<Playlist>{
    if(!data){
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    const updatedPlayListData =  await this.playListRepository.updatePlayListBlockStatus(data)
    if(!updatedPlayListData){
      throw new validationError(HttpStatusMessages.FailedToUpdateBlockStatus)
    }

    return updatedPlayListData
  }

  public async getAllPlayListsOfTrainer(trainerId:IdDTO): Promise<Playlist[]> {
    if(!trainerId){
        throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    const playListData =  await this.playListRepository.getFullPlayListsOfTrainer(trainerId)

    return playListData
  }

  public async editVideo (data:EditVideo): Promise<Video> {
    if(!data){
        throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
    }
    const editedVideo =  await this.videoRepository.editVideo(data)

    if(!editedVideo){
        throw new validationError(HttpStatusMessages.FailedToEditVideo)
    }

    if(editedVideo && data.playLists && data.playLists.length > 0) {
      const videoPlayListDocs = data.playLists.map((list)=>({
        videoId:editedVideo._id.toString(),
        playListId:list,
    }))
     
      const videoIdsToDelete = videoPlayListDocs.map((list)=>list.videoId)
      await this.playListRepository.updateManyVideoCount(data.playLists)
      await this.videoPlayListRepository.bulkWriteAddNewDeleteUnused(videoPlayListDocs,videoIdsToDelete)
    }
    return editedVideo
  }

}
