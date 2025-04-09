import mongoose from "mongoose";
import { CreatedVideoDTO, EditVideo, UpdateVideoBlockStatus } from "../../../application/dtos/contentDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { Video } from "../../../domain/entities/videoEntity";
import { videoRepository } from "../../../domain/interfaces/videoRepository";
import videoModel from "../models/videoModel";
import { GetVideoQueryDTO } from "../../../application/dtos/queryDTOs";

export class MonogVideoRepository implements videoRepository { 
    public async createVideo(data: CreatedVideoDTO): Promise<Video> {
        
     const { trainerId, title, description, thumbnail, video, playLists,duration } = data
     const trainerIdObjectId = new mongoose.Types.ObjectId(trainerId);
     const playListsObjectId = playLists.map((playlist) => new mongoose.Types.ObjectId(playlist));
     const createdVideo = await videoModel.create({
        trainerId: trainerIdObjectId,
        title,
        description,
        thumbnail,
        video,
        duration,
        playLists: playListsObjectId,
    });
    return createdVideo.toObject();
    }

    public async updateVideoBlockStatus(data: UpdateVideoBlockStatus): Promise<Video| null> {

        const {videoId,privacy} = data
        return await videoModel.findByIdAndUpdate({_id:new mongoose.Types.ObjectId(videoId)},{privacy:privacy},{new:true})
    }
    public async getVideosOfTrainerByTrainerId(trainerId:IdDTO,data:GetVideoQueryDTO):Promise<{videoList:Video[],  paginationData:PaginationDTO}>{
        const { page, limit, search, filters ,fromDate,toDate} = data;
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        let matchQuery: any = {};

        if(data){
            if(search){
                matchQuery.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                  ];
            }

            if (filters && filters.length > 0 && !filters.includes("All")) {
                const conditions: any = [];
                if (filters.includes("Active")) conditions.push({ privacy: false });
                if (filters.includes("Inactive")) conditions.push({ privacy: true });
                if (conditions.length > 0) matchQuery.$and = conditions;
            }
        }

        if (fromDate || toDate) {
            matchQuery.createdAt = {};
            if (fromDate) {
              matchQuery.createdAt.$gte = new Date(fromDate);
            }
            if (toDate) {
              matchQuery.createdAt.$lte = new Date(toDate);
            }
        }

         const totalCount = await videoModel.countDocuments({trainerId:trainerId,...matchQuery})
         const videoList =  await videoModel.find({trainerId:trainerId,...matchQuery}) 
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 })
        .lean();

        const totalPages = Math.ceil(totalCount / limitNumber);
        return {
            videoList,
            paginationData: {
              currentPage: pageNumber ,
              totalPages: totalPages,
            },
          };

    }

    public async getVideoById(data:IdDTO):Promise<Video | null>{
        return await videoModel.findOne({_id:new mongoose.Types.ObjectId(data)})
    }

    public async editVideo(data:EditVideo):Promise<Video | null>{

        const {_id,title,description,duration,thumbnail,video} = data
        return await videoModel.findByIdAndUpdate(new mongoose.Types.ObjectId(_id),
                    {title:title,description:description,duration:duration,thumbnail:thumbnail,video:video})
    }

}