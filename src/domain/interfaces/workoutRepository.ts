import { CustomUserDashBoardQueryDTO, GetWorkoutQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { WorkoutDBdto, WorkoutDTO } from "../../application/dtos/workoutDTOs";
import { Workout, WorkoutChartData } from "../entities/workoutEntity";

export interface WorkoutRepository {
    addWorkout(data:WorkoutDBdto[]):Promise<Workout[]>
    getWorkoutsByUserId(userId:IdDTO,data:GetWorkoutQueryDTO):Promise<{workoutList:Workout[],  paginationData:PaginationDTO}>
    deleteWorkoutSet(setId:IdDTO):Promise<Workout | null>
    markAsCompleted(setId:IdDTO):Promise<Workout | null>
    getUserDashBoardChartData(data:CustomUserDashBoardQueryDTO):Promise<WorkoutChartData[]>
    getTotalWorkoutTime(userId:string):Promise<number>
    getTodaysTotalPendingWorkouts(userId:string,startDate:Date,endDate:Date):Promise<number>
    getTodaysTotalCompletedWorkouts(userId:string,startDate:Date,endDate:Date):Promise<number>
}