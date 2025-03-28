import { NextFunction,Request,Response } from "express";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";
import { ContentManagementUseCase } from "../../application/usecases/contentManagementUseCase";
import { MonogVideoPlayListRepository } from "../../infrastructure/databases/repositories/mongoVideoPlayList";
import { MongoPlayListRepository } from "../../infrastructure/databases/repositories/mongoPlayListRepository";
import { MonogVideoRepository } from "../../infrastructure/databases/repositories/mongoVideoRepository";

//MONGO REPOSITORY INSTANCES
const mongoPlayListRepository = new MongoPlayListRepository()
const monogVideoRepository = new MonogVideoRepository()
const monogVideoPlayListRepository = new MonogVideoPlayListRepository()

//USE CASE INSTANCES
const contentManagementUseCase = new ContentManagementUseCase(mongoPlayListRepository,monogVideoRepository,monogVideoPlayListRepository)

export class ContentController {
    
static async addPlaylist(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const {_id} = req.user
    const {title} = req.body
    const createdPlayList = await contentManagementUseCase.createPlayList({trainerId:_id,title});
    sendResponse(res,HttpStatusCodes.OK,createdPlayList,HttpStatusMessages.PlayListCreated);
    } catch (error: any) {
      console.log(`Error creating playlist: ${error}`);
      next(error)
    }
  }

static async getPlayListsOfTrainer(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const _id = req.user._id 
    const trainerPlaylists= await contentManagementUseCase.getPlayListsOfTrainer(_id)
    console.log("hello playlists",trainerPlaylists)
    sendResponse(res,HttpStatusCodes.OK,trainerPlaylists,HttpStatusMessages.PlayListsOfTrainerRetrievedSuccessfully);
  } catch (error: any) {
    console.log(`Error getting playlists of trainer: ${error}`);
    next(error)
  }
}

static async addVideo(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const {_id} = req.user
    const createdVideo = await contentManagementUseCase.createdVideo({trainerId:_id,...req.body});
    sendResponse(res,HttpStatusCodes.OK,createdVideo,HttpStatusMessages.VideoUploadedSuccessfully);
  } catch (error: any) {
    console.log(`Error uploading video: ${error}`);
    next(error)
  }
}

static async getVideosByTrainerId(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const {_id} = req.user
    const videosOfTrainer = await contentManagementUseCase.getVideosByTrainerId(_id);
    sendResponse(res,HttpStatusCodes.OK,videosOfTrainer,HttpStatusMessages.VideoDataRetrievedSuccessfully);
  } catch (error: any) {
    console.log(`Error getting videos of trainer: ${error}`);
    next(error)
  }
}

static async getVideosByPlaylistId(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { playListId }= req.params
    const videosData = await contentManagementUseCase.getVideosByPlayListId(playListId)
    sendResponse(res,HttpStatusCodes.OK,videosData,HttpStatusMessages.VideoDataRetrievedSuccessfully)
  } catch (error: any) {
    console.log(`Error retrieving videos by playlist ID: ${error}`);
    next(error)
  }
}

static async getPlayListsByTrainerId(req:Request,res:Response,next:NextFunction):Promise<void>{
  try {
    const trainerId = req.params.trainerId
    const playListsOfTrainer = await contentManagementUseCase.getPlayListsOfTrainer(trainerId)
    sendResponse(res,HttpStatusCodes.OK,playListsOfTrainer,HttpStatusMessages.PlayListsOfTrainerRetrievedSuccessfully);
  } catch (error) {
    console.log(`Error getting trainer playlists: ${error}`);
    next(error)
  }      
}

static async getVideoById(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { videoId }= req.params
    const videoData = await contentManagementUseCase.getVideoById(videoId)
    sendResponse(res,HttpStatusCodes.OK,videoData,HttpStatusMessages.VideoDataRetrievedSuccessfully)
  } catch (error: any) {
    console.log(`Error retrieving video data: ${error}`);
    next(error)
  }
}

static async getRelatedVideos(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { playListId }= req.params
    const videosData = await contentManagementUseCase.getVideosByPlayListId(playListId)
    sendResponse(res,HttpStatusCodes.OK,videosData,HttpStatusMessages.VideoDataRetrievedSuccessfully)
  } catch (error: any) {
    console.log(`Error retrieving related videos: ${error}`);
    next(error)
  }
}
      
}