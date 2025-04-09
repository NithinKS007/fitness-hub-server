import mongoose from "mongoose";
import { Workout } from "../../domain/entities/workoutEntity";
import { WorkoutRepository } from "../../domain/interfaces/workoutRepository";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { GetWorkoutQueryDTO } from "../dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../dtos/utilityDTOs";
import { WorkoutDBdto, WorkoutDTO } from "../dtos/workoutDTOs";


export class WorkOutUseCase {
    constructor(private workoutRepository:WorkoutRepository){}
    public async addWorkout(userId:IdDTO,data:WorkoutDTO):Promise<Workout[]> {

     const {date,workouts} = data
     const workoutDate = new Date(date);

     const userObjectId = new mongoose.Types.ObjectId(userId) 
     const workoutItems: WorkoutDBdto[] = Object.entries(workouts).flatMap(
      ([bodyPart, workout]: [string, any]) =>
        workout.exercises.flatMap((exercise: any) =>
          exercise.sets.map((set: any) => ({
            userId: userObjectId,
            date: workoutDate,
            bodyPart,
            exerciseName: exercise.name,
            kg: set.kg,
            reps: set.reps,
            time: set.time,
            isCompleted: false,
          }))
        )
    );
    const addedWorkout = await this.workoutRepository.addWorkout(workoutItems)
    if(!addedWorkout){
     throw new validationError(HttpStatusMessages.FailedToAddWorkout)
    }
    return addedWorkout
  }

   public async getWorkoutsByUserId(userId:IdDTO,data:GetWorkoutQueryDTO):Promise<{workoutList:Workout[],  paginationData:PaginationDTO}> {

    const {workoutList,paginationData} = await this.workoutRepository.getWorkoutsByUserId(userId,data)

    return {workoutList,paginationData}
   }

   public async deleteWorkoutSet(setId:IdDTO):Promise<Workout> {

    const deletedWorkoutSet = await this.workoutRepository.deleteWorkoutSet(setId)

    if(!deletedWorkoutSet){
      throw new validationError(HttpStatusMessages.FailedToDeletWorkoutSet)
    }

    return deletedWorkoutSet

   }

   public async markSetAsCompleted(setId:IdDTO):Promise<Workout> {

    const completeWorkoutSet = await this.workoutRepository.markAsCompleted(setId)

    if(!completeWorkoutSet){
      throw new validationError(HttpStatusMessages.FailedToMarkCompletionSetStatus)
    }
    
    return completeWorkoutSet

   }
}