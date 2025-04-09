import { NextFunction,Request,Response } from "express";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";
import { ContentManagementUseCase } from "../../application/usecases/contentManagementUseCase";
import { MonogVideoPlayListRepository } from "../../infrastructure/databases/repositories/videoPlayList";
import { MongoPlayListRepository } from "../../infrastructure/databases/repositories/playListRepository";
import { MonogVideoRepository } from "../../infrastructure/databases/repositories/videoRepository";

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
    const trainerId = req.user._id 
    const {fromDate,toDate, page,limit,search,filters} = req.query
    const { playList,paginationData } = await contentManagementUseCase.getPlayListsOfTrainer(trainerId,{fromDate:fromDate as any,toDate:toDate as any, page:page as string,limit:limit as string,search:search as string,filters:filters as string[]})
    sendResponse(res,HttpStatusCodes.OK,{playList:playList,paginationData:paginationData},HttpStatusMessages.PlayListsOfTrainerRetrievedSuccessfully);
  } catch (error: any) {
    console.log(`Error getting playlists of trainer: ${error}`);
    next(error)
  }
}

static async getAllPlayListsOfTrainer(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const trainerId = req.user._id 
    const playListData= await contentManagementUseCase.getAllPlayListsOfTrainer(trainerId)
    sendResponse(res,HttpStatusCodes.OK,playListData,HttpStatusMessages.PlayListsOfTrainerRetrievedSuccessfully);
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
    const {fromDate,toDate, page,limit,search,filters} = req.query
    const {videoList,paginationData} = await contentManagementUseCase.getVideosByTrainerId(_id,{fromDate:fromDate as any,toDate:toDate as any, page:page as string,limit:limit as string,search:search as string,filters:filters as string[]});
    sendResponse(res,HttpStatusCodes.OK,{videoList:videoList,paginationData:paginationData},HttpStatusMessages.VideoDataRetrievedSuccessfully);
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
    // const playListsOfTrainer = await contentManagementUseCase.getPlayListsOfTrainer(trainerId)
    sendResponse(res,HttpStatusCodes.OK,{playListsOfTrainer:[]},HttpStatusMessages.PlayListsOfTrainerRetrievedSuccessfully);
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
    sendResponse(res,HttpStatusCodes.OK,videosData.slice(0,5),HttpStatusMessages.VideoDataRetrievedSuccessfully)
  } catch (error: any) {
    console.log(`Error retrieving related videos: ${error}`);
    next(error)
  }
}

static async updateVideoBlockStatus(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { videoId }= req.params
    console.log("video blocked",videoId)
    const { privacy } = req.body;
    console.log("privacy",privacy)
    const videoData = await contentManagementUseCase.updateVideoBlockStatus({videoId,privacy})
    sendResponse(res,HttpStatusCodes.OK,videoData,HttpStatusMessages.BlockStatusUpdated)
  } catch (error: any) {
    console.log(`Error updateing video block status: ${error}`);
    next(error)
  }
}

static async updatePlayListBlockStatus(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { playListId }= req.params
    console.log("playlist blocked",playListId)
    const { privacy } = req.body;
    console.log("privacy",privacy)
    const playListData = await contentManagementUseCase.updatePlayListBlockStatus({playListId,privacy})
    sendResponse(res,HttpStatusCodes.OK,playListData,HttpStatusMessages.BlockStatusUpdated)
  } catch (error: any) {
    console.log(`Error updateing playlist block status: ${error}`);
    next(error)
  }
}

static async editVideoData(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { videoId }= req.params
    const trainerId = req.user._id
    console.log("id for editing received in the backend",videoId)
    console.log("data received for editing",req.body)
    const {title,description,video,thumbnail,playLists,duration} = req.body
    const editedVideoData = await contentManagementUseCase.editVideo
    ( 
      {
      trainerId:trainerId as string,_id:videoId as string,title:title as string,
      description:description as string,video:video as string,thumbnail:thumbnail as string,
      playLists:playLists as string[],duration:duration as number
      }
    )

    console.log("edited video data",editedVideoData)
    sendResponse(res,HttpStatusCodes.OK,editedVideoData,HttpStatusMessages.videoEditedSuccessfully)
  } catch (error: any) {
    console.log(`Error updateing video data: ${error}`);
    next(error)
  }
}

static async editPlayListData(req: Request, res: Response,next:NextFunction): Promise<void> {
  try {
    const { playListId }= req.params
    console.log("id for editing received in the backend",playListId)
    console.log("data received for editing",req.body)
    sendResponse(res,HttpStatusCodes.OK,null,HttpStatusMessages.PlayListEditedSuccessfully)
  } catch (error: any) {
    console.log(`Error updateing playlist data: ${error}`);
    next(error)
  }
}


      
}