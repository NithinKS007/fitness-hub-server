import { NextFunction,Request,Response } from "express";
import { HttpStatusCodes, HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { sendResponse } from "../../shared/utils/httpResponse";
import { BookingSlotUseCase } from "../../application/usecases/bookingSlotUseCase";
import { MongoBookingSlotRepository } from "../../infrastructure/databases/repositories/bookingSlotRepository";
import { MongoAppointmentRepository } from "../../infrastructure/databases/repositories/appointmentRepository";
import { MongoVideoCallLogRepository } from "../../infrastructure/databases/repositories/videoCallLogRepository";

//MONGO REPOSITORY INSTANCES
const mongoBookingSlotRepository = new MongoBookingSlotRepository()
const mongoAppointmentRepository = new MongoAppointmentRepository()
const mongoVideoCallLogRepository = new MongoVideoCallLogRepository()

//USE CASE INSTANCES
const bookingSlotUseCase = new BookingSlotUseCase(mongoBookingSlotRepository,mongoAppointmentRepository,mongoVideoCallLogRepository)

export class BookingController {
static async getAppointmentVideoCallLogsTrainer (req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const { _id } = req.user
        const{fromDate,toDate, page,limit,search,filters} = req.query
        const {trainerVideoCallLogList,paginationData} = await bookingSlotUseCase.getTrainerVideoCallLogs(_id,{fromDate:fromDate as any,toDate:toDate as any, page:page as string,limit:limit as string,search:search as string,filters:filters as string[]})
        sendResponse(res,HttpStatusCodes.OK,{trainerVideoCallLogList,paginationData},HttpStatusMessages.VideoCallLogsRetrievedSuccessfully)
    } catch (error: any) {
        console.log(`Error retrieving video call logs for trainer: ${error}`);
        next(error)
    }
}

static async deleteBookingSlot(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const bookingSlotId = req.params.bookingSlotId
        const deletedSlotData = await bookingSlotUseCase.deleteBookingSlot(bookingSlotId)
        sendResponse(res,HttpStatusCodes.OK,deletedSlotData,HttpStatusMessages.SlotDeletedSuccessfully)
    } catch (error: any) {
        console.log(`Error deleting slot: ${error}`);
        next(error)
    }
}
      
static async cancelAppointment(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const appointmentId = req.params.appointmentId
        const cancelledAppointmentData = await bookingSlotUseCase.cancelAppointment(appointmentId)
        sendResponse(res,HttpStatusCodes.OK,cancelledAppointmentData,HttpStatusMessages.AppointmentCancelledSuccessfully)
    } catch (error: any) {
        console.log(`Error cancelling appointment: ${error}`);
        next(error)
    }
}

static async getTrainerBookingSchedules(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const {_id} = req.user
        const{fromDate,toDate, page,limit,search,filters} = req.query
        console.log("req.query",req.query)
        const {trainerBookingSchedulesList,paginationData} = await bookingSlotUseCase.getTrainerBookingSchedules(_id,{fromDate:fromDate as any,toDate:toDate as any, page:page as string,limit:limit as string,search:search as string,filters:filters as string[]})
        sendResponse(
        res,
        HttpStatusCodes.OK,
        {trainerBookingSchedulesList:trainerBookingSchedulesList,paginationData:paginationData},
        HttpStatusMessages.AppointmentsListRetrievedSuccessfully
        );
    } catch (error: any) {
        console.log(`Error retrieving booking schedules for trainer: ${error}`);
        next(error)
    }
}
static async handleBookingRequest(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
    const {appointmentId,bookingSlotId,action} = req.body
    const appointmentData = await bookingSlotUseCase.approveOrRejectBooking({appointmentId,bookingSlotId,action})
        if(appointmentData.status==="approved"){
        sendResponse(res,HttpStatusCodes.OK,appointmentData,HttpStatusMessages.BookingApproved);
        } else if(appointmentData.status==="rejected"){
        sendResponse(res,HttpStatusCodes.OK,appointmentData,HttpStatusMessages.BookingRejected);
        }
    } catch (error: any) {
        console.log(`Error changing booking status: ${error}`);
        next(error)
    }
}

static async addBookingSlot(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const {_id} = req.user
        const slotData = req.body
        const createdSlotData = await bookingSlotUseCase.addBookingSlot({trainerId:_id,...slotData});
        sendResponse(res,HttpStatusCodes.OK,createdSlotData,HttpStatusMessages.SlotCreatedSuccessfully);
    } catch (error: any) {
        console.log(`Error creating slot: ${error}`);
        next(error)
    }
}

static async getAvailableSlots(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const {_id} = req.user
        const {fromDate,toDate, page,limit} = req.query
        console.log("this is query in available slots",req.query)
        const {availableSlotsList,paginationData} = await bookingSlotUseCase.getAvailableSlots(_id,{fromDate:fromDate as any,toDate:toDate as any,page:page as string,limit:limit as string});
        sendResponse(res,HttpStatusCodes.OK,{availableSlotsList:availableSlotsList,paginationData:paginationData},HttpStatusMessages.SlotDataRetrievedSuccessfully);
    } catch (error: any) {
        console.log(`Error retrieving available slot details: ${error}`);
        next(error)
    }
}

static async getBookingRequests(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const {_id} = req.user
        const {fromDate,toDate, page,limit,search,filters} = req.query
        const {bookingRequestsList,paginationData} = await bookingSlotUseCase.getBookingRequests(_id,{fromDate:fromDate as any,toDate:toDate as any, page:page as string,limit:limit as string,search:search as string,filters:filters as string[]})
        sendResponse(res,HttpStatusCodes.OK,{bookingRequestsList,paginationData},HttpStatusMessages.BookingRequestsRetrievedSuccessfully);
    } catch (error: any) {
        console.log(`Error retrieving booking requests: ${error}`);
        next(error)
    }
}

static async getTrainerBookingSlots(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const trainerId = req.params.trainerId
        const bookingSlotsOfTrainer = await bookingSlotUseCase.getAvailableSlotsUser(trainerId)
        sendResponse(res,HttpStatusCodes.OK,bookingSlotsOfTrainer,HttpStatusMessages.SlotDataRetrievedSuccessfully);
    } catch (error) {
        console.log(`Error retrieving slot list of trainer: ${error}`);
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
        console.log(`Error booking slot: ${error}`);
        next(error)
    }    
}

static async getUserBookingSchedules(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const {_id} = req.user
        console.log("query",req.query)
        const {fromDate,toDate, page,limit,search,filters} = req.query
        const {appointmentList,paginationData} = await bookingSlotUseCase.getUserBookingSchedules(_id,{fromDate:fromDate as any,toDate:toDate as any, page:page as string,limit:limit as string,search:search as string,filters:filters as string[]})
        sendResponse(res,HttpStatusCodes.OK,{appointmentList:appointmentList,paginationData:paginationData},HttpStatusMessages.AppointmentsListRetrievedSuccessfully);
    } catch (error) {
        console.log(`Error retrieving appointments for user: ${error}`);
        next(error)
    }      
}

static async getUserVideoCallLogs(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const { _id }= req.user
        
        console.log("queryies",req.query)
        const {fromDate,toDate, page,limit,search,filters} = req.query
        const {userVideoCallLogList,paginationData }= await bookingSlotUseCase.getUserVideoCallLogs(_id,{fromDate:fromDate as any,toDate:toDate as any, page:page as string,limit:limit as string,search:search as string,filters:filters as string[]})
        sendResponse(res,HttpStatusCodes.OK,{userVideoCallLogList,paginationData},HttpStatusMessages.VideoCallLogsRetrievedSuccessfully)
    } catch (error: any) {
        console.log(`Error retrieving video call logs for user: ${error}`);
        next(error)
    }
}
      
}