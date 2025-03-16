import { NextFunction,Request,Response } from "express";
import { UpdateProfileUseCase } from "../../domain/usecases/updateProfileUseCase";
import { MonogTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { sendResponse } from "../../shared/utils/httpResponse";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { TrainerUseCase } from "../../domain/usecases/trainerUseCase";
import { SubscriptionUseCase } from "../../domain/usecases/subscriptionUseCase";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/mongoSubscriptionRepository";
import { MonogUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/mongoUserSubscriptionRepository";
import { ContentManagementUseCase } from "../../domain/usecases/contentManagementUseCase";
import { MongoPlayListRepository } from "../../infrastructure/databases/repositories/mongoPlayListRepository";
import { MonogVideoRepository } from "../../infrastructure/databases/repositories/mongoVideoRepository";
import { BookingSlotUseCase } from "../../domain/usecases/bookingSlotUseCase";
import { MongoBookingSlotRepository } from "../../infrastructure/databases/repositories/mongoBookingSlotRepository";
import { MongoAppointmentRepository } from "../../infrastructure/databases/repositories/mongoAppointmentRepository";

const mongoUserRepository = new MongoUserRepository()
const mongoTrainerRepository = new MonogTrainerRepository()
const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const mongoUserSubscriptionPlanRepository = new MonogUserSubscriptionPlanRepository()
const mongoPlayListRepository = new MongoPlayListRepository()
const mongoVideoRepository = new MonogVideoRepository()
const mongoBookingSlotRepository = new MongoBookingSlotRepository()
const mongoAppointmentRepository = new MongoAppointmentRepository()
const profileUseCase = new UpdateProfileUseCase(mongoUserRepository,mongoTrainerRepository)
const trainerUseCase = new TrainerUseCase(mongoTrainerRepository)
const subscriptionSUseCase = new SubscriptionUseCase(mongoSubscriptionRepository,mongoTrainerRepository,mongoUserSubscriptionPlanRepository)
const contentManagementUseCase = new ContentManagementUseCase(mongoPlayListRepository,mongoVideoRepository)
const bookingSlotUseCase = new BookingSlotUseCase(mongoBookingSlotRepository,mongoAppointmentRepository)


export class UserController {

    static async updateUserProfile(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {_id} = req.user

            console.log("body data received",req.body)
            const updatedUserData = await profileUseCase.updateUserProfile({_id,...req.body});
            sendResponse(
              res,
              HttpStatusCodes.OK,
              updatedUserData,
              HttpStatusMessages.UserDetailsUpdated
            );
        } catch (error:any) {
            console.log(`Error in updating trainer profile: ${error}`);
            next(error)
        }
    }
    static async getApprovedTrainers(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {

            console.log("query received",req.query)
            const searchFilterQuery = req.query
            const trainersData = await trainerUseCase.getApprovedTrainers(searchFilterQuery)
            sendResponse(res,HttpStatusCodes.OK,trainersData,HttpStatusMessages.TrainersList);
        } catch (error) {
           console.log(`Error in retrieving trainers list  : ${error}`);
           next(error)
         }      
      }

    static async getApprovedTrainerDetailsWithSub(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const { _id } = req.params
            const trainersData = await trainerUseCase.getApprovedTrainerDetailsWithSub(_id)
            sendResponse(res,HttpStatusCodes.OK,trainersData,HttpStatusMessages.TrainersList);
        } catch (error) {
           console.log(`Error in retrieving trainers list  : ${error}`);
           next(error)
         }      
    }

    static async getUserSubscriptions(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const { _id } = req.user
            const userSubscriptionsData = await subscriptionSUseCase.getUserSubscriptionsData(_id)
            sendResponse(res,HttpStatusCodes.OK,userSubscriptionsData,HttpStatusMessages.SubscriptionListOfUserRetrievedSuccessfully);
        } catch (error) {
           console.log(`Error in retrieving trainers list  : ${error}`);
           next(error)
         }      
    }
    static async isSubscribedToTheTrainer(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const { _id } = req.user
            const trainerId = req.params._id
            const isUserSubscribedToTheTrainer = await subscriptionSUseCase.isUserSubscribedToTheTrainer({_id,trainerId})
            sendResponse(res,HttpStatusCodes.OK,{isUserSubscribedToTheTrainer},HttpStatusMessages.UserIsSubscribed);
        } catch (error) {
           console.log(`Error in checking user subscription status: ${error}`);
           next(error)
         }      
    }
    static async getPlayListsOfTrainer(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const trainerId = req.params._id
            const playListsOfTrainer = await contentManagementUseCase.getPlayListsOfTrainer(trainerId)
            sendResponse(res,HttpStatusCodes.OK,playListsOfTrainer,HttpStatusMessages.PlayListsOfTrainerRetrievedSuccessfully);
        } catch (error) {
           console.log(`Error in getting trainer playlists: ${error}`);
           next(error)
         }      
    }

    static async getBookingSlotsOfTrainer(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const trainerId = req.params.trainerId
            const bookingSlotsOfTrainer = await bookingSlotUseCase.getAvailableSlots(trainerId)
            sendResponse(res,HttpStatusCodes.OK,bookingSlotsOfTrainer,HttpStatusMessages.SlotDataRetrievedSuccessfully);
        } catch (error) {
           console.log(`Error to get slot list of trainer: ${error}`);
           next(error)
         }      
    }

    static async bookAppointment(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const slotId = req.params.slotId
            const {_id} = req.user
            const bookedSlotData = await bookingSlotUseCase.bookSlotAppointment({slotId,userId:_id})
            sendResponse(res,HttpStatusCodes.OK,bookedSlotData,HttpStatusMessages.SlotBookedSuccessfully);
        } catch (error) {
           console.log(`Error to book slot: ${error}`);
           next(error)
         }      
    }

    static async getBookingSchedulesUser(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {_id} = req.user
            const appointmentsData = await bookingSlotUseCase.getBookingSchedulesUser(_id)
            sendResponse(res,HttpStatusCodes.OK,appointmentsData,HttpStatusMessages.AppointmentsListRetrievedSuccessfully);
        } catch (error) {
           console.log(`Error to get appointments for user: ${error}`);
           next(error)
         }      
    }

   static async cancelAppointmentSchedule(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
  
           const appointmentId = req.params.appointmentId
           const cancelledAppointmentData = await bookingSlotUseCase.cancelAppointmentSchedule(appointmentId)
            sendResponse(
              res,
              HttpStatusCodes.OK,
              cancelledAppointmentData,
              HttpStatusMessages.AppointmentCancelledSuccessfully
            )
        } catch (error: any) {
          console.log(`Error to cancel appointment: ${error}`);
          next(error)
        }
      }

    
}