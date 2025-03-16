import { NextFunction,Request,Response } from "express";
import { MongoUserRepository } from "../../infrastructure/databases/repositories/mongouserRepository";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";
import { UpdateProfileUseCase } from "../../domain/usecases/updateProfileUseCase";
import { MonogTrainerRepository } from "../../infrastructure/databases/repositories/mongoTrainerRepository";
import { SubscriptionUseCase } from "../../domain/usecases/subscriptionUseCase";
import { MongoSubscriptionRepository } from "../../infrastructure/databases/repositories/mongoSubscriptionRepository";
import { MonogUserSubscriptionPlanRepository } from "../../infrastructure/databases/repositories/mongoUserSubscriptionRepository";
import { MongoPlayListRepository } from "../../infrastructure/databases/repositories/mongoPlayListRepository";
import { ContentManagementUseCase } from "../../domain/usecases/contentManagementUseCase";
import { MonogVideoRepository } from "../../infrastructure/databases/repositories/mongoVideoRepository";
import { MongoBookingSlotRepository } from "../../infrastructure/databases/repositories/mongoBookingSlotRepository";
import { BookingSlotUseCase } from "../../domain/usecases/bookingSlotUseCase";
import { MongoAppointmentRepository } from "../../infrastructure/databases/repositories/mongoAppointmentRepository";

const mongoUserRepository = new MongoUserRepository()
const monogTrainerRepository = new MonogTrainerRepository()
const mongoSubscriptionRepository = new MongoSubscriptionRepository()
const mongoUserSubscriptionPlanRepository = new MonogUserSubscriptionPlanRepository() 
const mongoPlayListRepository = new MongoPlayListRepository()
const monogVideoRepository = new MonogVideoRepository()
const mongoBookingSlotRepository = new MongoBookingSlotRepository()
const mongoAppointmentRepository = new MongoAppointmentRepository()
const subscriptionUseCase = new SubscriptionUseCase(mongoSubscriptionRepository,monogTrainerRepository,mongoUserSubscriptionPlanRepository)
const profileUseCase = new UpdateProfileUseCase(mongoUserRepository,monogTrainerRepository)
const contentManagementUseCase = new ContentManagementUseCase(mongoPlayListRepository,monogVideoRepository)
const bookingSlotUseCase = new BookingSlotUseCase(mongoBookingSlotRepository,mongoAppointmentRepository)




export class TrainerController {
   static async updateTrainerProfile(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {

         const {_id} = req.user
        const updatedTrainerData = await profileUseCase.updateTrainerProfile({_id,...req.body});
        sendResponse(
          res,
          HttpStatusCodes.OK,
          updatedTrainerData,
          HttpStatusMessages.UserDetailsUpdated
        );
      } catch (error: any) {
        console.log(`Error in updating trainer profile: ${error}`);
        next(error)
      }
    }

    static async getTrainerSubscribedUsers(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {

         const {_id} = req.user
        const subscribedUsersList = await subscriptionUseCase.getTrainerSubscribedUsers(_id);
        sendResponse(
          res,
          HttpStatusCodes.OK,
          subscribedUsersList,
          HttpStatusMessages.SubscriptionsListRetrieved
        );
      } catch (error: any) {
        console.log(`Error to get trainers subscribers list: ${error}`);
        next(error)
      }
    }

    static async addPlaylist(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {
         const {_id} = req.user
         const {title} = req.body
        const createdPlayList = await contentManagementUseCase.createPlayList({trainerId:_id,title});
        sendResponse(
          res,
          HttpStatusCodes.OK,
          createdPlayList,
          HttpStatusMessages.PlayListCreated
        );
      } catch (error: any) {
        console.log(`Error to create playlist: ${error}`);
        next(error)
      }
    }

    static async getPlayListsOfTrainer(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {
         const {_id} = req.user
         const trainerPlaylists= await contentManagementUseCase.getPlayListsOfTrainer(_id)
         console.log("playlists fetched successfully",trainerPlaylists)
        sendResponse(
          res,
          HttpStatusCodes.OK,
          trainerPlaylists,
          HttpStatusMessages.PlayListsOfTrainerRetrievedSuccessfully
        );
      } catch (error: any) {
        console.log(`Error to get playlists of trainer: ${error}`);
        next(error)
      }
    }
    static async addVideo(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {
         const {_id} = req.user
         const createdVideo = await contentManagementUseCase.createdVideo({trainerId:_id,...req.body});
        sendResponse(
          res,
          HttpStatusCodes.OK,
          createdVideo,
          HttpStatusMessages.VideoUploadedSuccessfully
        );
      } catch (error: any) {
        console.log(`Error to create video: ${error}`);
        next(error)
      }
    }

    static async getVideosOfTrainerByTrainerId(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {
         const {_id} = req.user
         const videosOfTrainer = await contentManagementUseCase.getVideosOfTrainerByTrainerId(_id);
        sendResponse(
          res,
          HttpStatusCodes.OK,
          videosOfTrainer,
          HttpStatusMessages.VideoDataRetrievedSuccessfully
        );
      } catch (error: any) {
        console.log(`Error to get videos of trainer: ${error}`);
        next(error)
      }
    }
    static async addBookingSlot(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {
         const {_id} = req.user
         const slotData = req.body
         const createdSlotData = await bookingSlotUseCase.addBookingSlot({trainerId:_id,...slotData});
        sendResponse(
          res,
          HttpStatusCodes.OK,
          createdSlotData,
          HttpStatusMessages.SlotCreatedSuccessfully
        );
      } catch (error: any) {
        console.log(`Error to create slot: ${error}`);
        next(error)
      }
    }
    static async getAvailableSlots(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {
         const {_id} = req.user
         const availableSlotsData = await bookingSlotUseCase.getAvailableSlots(_id);
        sendResponse(
          res,
          HttpStatusCodes.OK,
          availableSlotsData,
          HttpStatusMessages.SlotDataRetrievedSuccessfully
        );
      } catch (error: any) {
        console.log(`Error to get available slot details: ${error}`);
        next(error)
      }
    }
    static async getBookingRequests(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {
         const {_id} = req.user
         const bookedSlots = await bookingSlotUseCase.getBookingRequests(_id)
        sendResponse(
          res,
          HttpStatusCodes.OK,
          bookedSlots,
          HttpStatusMessages.BookingRequestsRetrievedSuccessfully
        );
      } catch (error: any) {
        console.log(`Error to get booking requests: ${error}`);
        next(error)
      }
    }

    static async approveRejectBookingRequest(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {

         const {appointmentId,bookingSlotId,action} = req.body
         const appointmentData = await bookingSlotUseCase.approveRejectBookingRequest({appointmentId,bookingSlotId,action})
         if(appointmentData.status==="approved"){
          sendResponse(
            res,
            HttpStatusCodes.OK,
            appointmentData,
            HttpStatusMessages.BookingApproved
          );
         } else if(appointmentData.status==="rejected"){
          sendResponse(
            res,
            HttpStatusCodes.OK,
            appointmentData,
            HttpStatusMessages.BookingRejected
          );
         }
      } catch (error: any) {
        console.log(`Error to change booking status: ${error}`);
        next(error)
      }
    }
    static async getBookingSchedulesForTrainer(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {

         const {_id} = req.user
         const appointmentsListData = await bookingSlotUseCase.getBookingSchedulesForTrainer(_id)

          sendResponse(
            res,
            HttpStatusCodes.OK,
            appointmentsListData,
            HttpStatusMessages.AppointmentsListRetrievedSuccessfully
          );
      } catch (error: any) {
        console.log(`Error to change booking status: ${error}`);
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

    static async deleteBookingSlot(req: Request, res: Response,next:NextFunction): Promise<void> {
      try {

         const bookingSlotId = req.params.bookingSlotId
         const deletedSlotData = await bookingSlotUseCase.deleteBookingSlot(bookingSlotId)
          sendResponse(
            res,
            HttpStatusCodes.OK,
            deletedSlotData,
            HttpStatusMessages.SlotDeletedSuccessfully
          )
      } catch (error: any) {
        console.log(`Error to delete slot: ${error}`);
        next(error)
      }
    }


}