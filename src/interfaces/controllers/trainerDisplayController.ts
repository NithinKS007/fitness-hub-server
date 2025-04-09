import { NextFunction,Request,Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { TrainerUseCase } from "../../application/usecases/trainerUseCase";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/trainerRepository";

//MONGO REPOSITORY INSTANCES
const mongoTrainerRepository = new MongoTrainerRepository()

//USE CASE INSTANCES
const trainerUseCase = new TrainerUseCase(mongoTrainerRepository)

export class TrainerDisplayController {

static async getApprovedTrainers(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        console.log("query received",req.query)
        const {page,limit,Search,Specialization,Experience,Gender,sort} = req.query

       
        const {trainersList,paginationData} = await trainerUseCase.getApprovedTrainers
                             ({page:page as string,limit:limit as string,
                                Search:Search as string,
                                Specialization:Specialization as string[],
                                Experience:Experience as string[],
                                Gender:Gender as string[],Sort:sort as string})

        console.log("paginatino data",paginationData)
        sendResponse(res,HttpStatusCodes.OK,{trainersList,paginationData},HttpStatusMessages.TrainersList);
    } catch (error) {
        console.log(`Error retrieving approved trainers list: ${error}`)
    next(error)
    }      
}

static async getApprovedTrainerDetailsWithSub(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const { _id } = req.params
        const trainersData = await trainerUseCase.getApprovedTrainerDetailsWithSub(_id)
        sendResponse(res,HttpStatusCodes.OK,trainersData,HttpStatusMessages.TrainersList);
    } catch (error) {
        console.log(`Error retrieving trainer details with subscription: ${error}`)
    next(error)
    }      
}

}