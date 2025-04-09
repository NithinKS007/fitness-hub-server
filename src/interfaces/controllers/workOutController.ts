import { NextFunction,Request,Response } from "express";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { WorkOutUseCase } from "../../application/usecases/workoutUseCase";
import { MongoWorkoutRepository } from "../../infrastructure/databases/repositories/workoutRepository";

const mongoWorkoutRepository = new MongoWorkoutRepository()
const workoutUseCase = new WorkOutUseCase(mongoWorkoutRepository)

export class WorkoutController {
static async addWorkout(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        console.log("req.bd",req.body) 
        const userId = req.user._id 
        const addedWorkOut = await workoutUseCase.addWorkout(userId,req.body)   
        sendResponse(res,HttpStatusCodes.OK,addedWorkOut,HttpStatusMessages.workoutAddedSuccessfully);
    } catch (error) {
        console.log(`Error to add workout: ${error}`)
    next(error)
    }      
}

static async getWorkoutsByUserId(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const userId = req.user._id 
        console.log("query for workout",req.query)
        const{fromDate,toDate, page,limit,search,filters} = req.query
        const {workoutList,paginationData} = await workoutUseCase.getWorkoutsByUserId(userId,{fromDate:fromDate as any,toDate:toDate as any, page:page as string,limit:limit as string,search:search as string,filters:filters as string[]})   
        sendResponse(res,HttpStatusCodes.OK,{workoutList:workoutList,paginationData:paginationData},HttpStatusMessages.WorkoutListRetrievedSuccessfully);
    } catch (error) {
        console.log(`Error to get user workouts: ${error}`)
    next(error)
    }      
}

static async deleteWorkoutSet(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const {setId} = req.params
        console.log("params",setId)
        const deletedWorkoutSet = await workoutUseCase.deleteWorkoutSet(setId)   
        sendResponse(res,HttpStatusCodes.OK,deletedWorkoutSet,HttpStatusMessages.WorkoutSetDeleted);
    } catch (error) {
        console.log(`Error to delete workout set: ${error}`)
    next(error)
    }      
}

static async markSetAsCompleted(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const {setId} = req.params
        console.log("params",setId)
        const completedWorkoutSet  = await workoutUseCase.markSetAsCompleted(setId)   
        sendResponse(res,HttpStatusCodes.OK,completedWorkoutSet,HttpStatusMessages.WorkoutSetCompleted);
    } catch (error) {
        console.log(`Error to mark workout as completed: ${error}`)
    next(error)
    }      
}

}