import { HandleBookingRequestDTO,BookAppointmentDTO,CreateBookingSlotDTO } from "../dtos/bookingDTOs";
import { IdDTO, PaginationDTO } from "../dtos/utilityDTOs";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { Appointment, AppointmentRequestsTrainer,AppointmentRequestsUser } from "../../domain/entities/appointmentEntity";
import { bookingSlot } from "../../domain/entities/bookingSlotEntity";
import { BookingSlotRepository } from "../../domain/interfaces/bookingSlotRepository";
import { AppointmentRepository } from "../../domain/interfaces/appointmentRepository";
import { VideoCallLogRepository } from "../../domain/interfaces/videoCallLogRepository";
import { GetAvailableSlotsDTO, GetBookingRequestsDTO, GetBookingSchedulesDTO, GetVideoCallLogQueryDTO } from "../dtos/queryDTOs";
import { TrainerVideoCallLog, UserVideoCallLog } from "../../domain/entities/videoCallLogEntity";

export class BookingSlotUseCase {
  constructor(private bookingSlotRepository:BookingSlotRepository, private appointmentRepository:AppointmentRepository,private videoCallLogRepository:VideoCallLogRepository) {}

  public async addBookingSlot(data:CreateBookingSlotDTO): Promise<bookingSlot> {

    const {date,...otherData} = data
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const createdSlotData = await this.bookingSlotRepository.addBookingSlot({date: new Date(date),...otherData})
    if(!createdSlotData){
      throw new validationError(HttpStatusMessages.FailedToCreateBookingSlot)
    }
    return createdSlotData
  }

  
  public async getAvailableSlots(_id:IdDTO,data:GetAvailableSlotsDTO): Promise<{availableSlotsList:bookingSlot[],paginationData:PaginationDTO}> {
    if (!_id) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    if(data.fromDate){
      data.fromDate = new Date(data.fromDate) 
    }

    if(data.toDate){
      data.toDate = new Date(data.toDate)
    }

    const {availableSlotsList,paginationData} = await this.bookingSlotRepository.getAvailableSlots(_id,data)
    if(!availableSlotsList){
      throw new validationError(HttpStatusMessages.FailedToGetAvailableSlotData)
    }
    return {availableSlotsList,paginationData}
  }

  public async getAvailableSlotsUser(data:IdDTO): Promise<bookingSlot[]> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const availableSlotData = await this.bookingSlotRepository.getAvailableSlotsUser(data)
    if(!availableSlotData){
      throw new validationError(HttpStatusMessages.FailedToGetAvailableSlotData)
    }
    return availableSlotData
  }


  public async bookSlotAppointment(data:BookAppointmentDTO):Promise<Appointment> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    const {slotId,userId} = data

    const bookingSlot = await this.bookingSlotRepository.findSlotById(slotId)

    if(!bookingSlot){
       throw new validationError(HttpStatusMessages.FailedToBookSlot)
    }

    if(bookingSlot.status==="booked" || bookingSlot.status==="completed"){
      throw new validationError(HttpStatusMessages.SlotCurrentlyUnavailable)
    }

    const { _id: bookingSlotId, trainerId, date: appointmentDate, time: appointmentTime } = bookingSlot;

    const appointmentData = await this.appointmentRepository.
                            createAppointment({bookingSlotId,trainerId,appointmentDate,appointmentTime,userId})

    const bookingSlotData = await this.bookingSlotRepository.findBookSlotAndChangeStatusTobooked(bookingSlot._id.toString())

    if(!appointmentData || !bookingSlotData) {
      throw new validationError(HttpStatusMessages.FailedToBookSlot)
    }
    return appointmentData
  }

  public async  getBookingRequests  (_id:IdDTO,data:GetBookingRequestsDTO):Promise<{bookingRequestsList:AppointmentRequestsTrainer[],paginationData:PaginationDTO}> {
    if (!_id) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    if(data.fromDate){
      data.fromDate = new Date(data.fromDate) 
    }

    if(data.toDate){
      data.toDate = new Date(data.toDate)
    }
    const{bookingRequestsList,paginationData } = await this.appointmentRepository.getBookingAppointmentRequests(_id,data)

    if(!bookingRequestsList){
      throw new validationError(HttpStatusMessages.FailedToRetrieveBookingRequests)
    }
    return {bookingRequestsList,paginationData }
  }
  public async approveOrRejectBooking(data:HandleBookingRequestDTO):Promise<Appointment> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const bookingSlotData = await this.bookingSlotRepository.findSlotById(data.bookingSlotId)

    if(!bookingSlotData){
      throw new validationError(HttpStatusMessages.BookingSlotNotFound)
    }

    const { bookingSlotId,appointmentId,action } = data
    
    if(action==="approved"){
      await this.bookingSlotRepository.findBookSlotAndChangeStatusToCompleted(bookingSlotId)
    }else{
      await this.bookingSlotRepository.findBookSlotAndChangeStatusToPending(bookingSlotId)
    }
    const appointmentData = await this.appointmentRepository
                           .approveOrRejectAppointment
                           ({appointmentId,action,bookingSlotId})

    if(!appointmentData){
      throw new validationError(HttpStatusMessages.FailedToApproveRejectBookingStatus)
    }
    return appointmentData
  }

  public async getTrainerBookingSchedules (_id:IdDTO,data:GetBookingSchedulesDTO):Promise<{trainerBookingSchedulesList: AppointmentRequestsTrainer[],paginationData:PaginationDTO}> {
    if (!_id) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    if(data.fromDate){
      data.fromDate = new Date(data.fromDate) 
    }

    if(data.toDate){
      data.toDate = new Date(data.toDate)
    }

    const {trainerBookingSchedulesList,paginationData} = await this.appointmentRepository.getTrainerBookingSchedules(_id,data)

    if(!trainerBookingSchedulesList){
      throw new validationError(HttpStatusMessages.FailedToRetrieveBookingRequests)
    }
    return {trainerBookingSchedulesList,paginationData}
  }
  public async cancelAppointment(data:IdDTO):Promise<Appointment> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const cancelledAppointment = await this.appointmentRepository.cancelAppointmentSchedule(data)

    if(!cancelledAppointment){
      throw new validationError(HttpStatusMessages.FailedToCancelAppointmentStatus)
    }

    const makingbookingSlotAvailableAgain = await this.bookingSlotRepository
                                           .findBookSlotAndChangeStatusToPending
                                           (cancelledAppointment.bookingSlotId.toString())
    if(!makingbookingSlotAvailableAgain){
      throw new validationError(HttpStatusMessages.FailedToCancelAppointmentStatus)
    }

    return cancelledAppointment
  }

  public async getUserBookingSchedules  (_id:IdDTO,data:GetBookingSchedulesDTO):Promise<{appointmentList:AppointmentRequestsUser[],paginationData:PaginationDTO}> {
    if (!_id) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    if(data.fromDate){
      data.fromDate = new Date(data.fromDate) 
    }

    if(data.toDate){
      data.toDate = new Date(data.toDate)
    }

    const {appointmentList,paginationData } = await this.appointmentRepository.getUserBookingSchedules(_id,data)

    if(!appointmentList){
      throw new validationError(HttpStatusMessages.FailedToRetrieveBookingRequests)
    }
    return {appointmentList,paginationData }
  }

  public async deleteBookingSlot (data:IdDTO):Promise<bookingSlot> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    const slotData = await this.bookingSlotRepository.findSlotById(data)

    if(slotData?.status==="booked" ||slotData?.status==="completed" ){
      throw new validationError(HttpStatusMessages.SlotCurrentlyUnavailable)
    }
    const deletedSlotData = await this.bookingSlotRepository.findByIdAndDeleteSlot(data)

    if(!deletedSlotData){
      throw new validationError(HttpStatusMessages.FailedToDeleteSlot)
    }
    return deletedSlotData
  }

  public async getAppointmentById (data:IdDTO):Promise<Appointment | null> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const appointmentData = await this.appointmentRepository.getAppointmentById(data)

    if(!appointmentData){
       throw new validationError(HttpStatusMessages.FailedToFindAppointment)
    }
    return appointmentData
  }

  public async getTrainerVideoCallLogs(_id:IdDTO,data:GetVideoCallLogQueryDTO):Promise<{trainerVideoCallLogList: TrainerVideoCallLog[],paginationData:PaginationDTO}> {
    if (!_id) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    if(data.fromDate){
      data.fromDate = new Date(data.fromDate) 
    }

    if(data.toDate){
      data.toDate = new Date(data.toDate)
    }

    const {trainerVideoCallLogList,paginationData} = await this.videoCallLogRepository.getTrainerVideoCallLogs(_id,data)
    
    if(!trainerVideoCallLogList){
       throw new validationError(HttpStatusMessages.FailedToRetrieveVideoCallLogs)
    }
    return {trainerVideoCallLogList,paginationData}
  }


  public async getUserVideoCallLogs(_id:IdDTO,data:GetVideoCallLogQueryDTO):Promise<{userVideoCallLogList: UserVideoCallLog[],paginationData:PaginationDTO}> {
    if (!_id) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }

    if(data.fromDate){
      data.fromDate = new Date(data.fromDate) 
    }

    if(data.toDate){
      data.toDate = new Date(data.toDate)
    }

    const {userVideoCallLogList,paginationData} = await this.videoCallLogRepository.getUserVideoCallLogs(_id,data)
    
    if(!userVideoCallLogList){
       throw new validationError(HttpStatusMessages.FailedToRetrieveVideoCallLogs)
    }
    return {userVideoCallLogList,paginationData}
  }

}