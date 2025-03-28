import { NextFunction,Request,Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { TrainerUseCase } from "../../application/usecases/trainerUseCase";
import { MongoTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";

//MONGO REPOSITORY INSTANCES
const mongoTrainerRepository = new MongoTrainerRepository()

//USE CASE INSTANCES
const trainerUseCase = new TrainerUseCase(mongoTrainerRepository)

export class TrainerDisplayController {

static async getApprovedTrainers(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        console.log("query received",req.query)
        const searchFilterQuery = req.query
        const trainersData = await trainerUseCase.getApprovedTrainers(searchFilterQuery)
        sendResponse(res,HttpStatusCodes.OK,trainersData,HttpStatusMessages.TrainersList);
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