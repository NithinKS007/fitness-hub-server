import { approveRejectBookingRequest, BookAppointment, CreateBookingSlot, IdDTO } from "../../application/dtos";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { appointment, AppointmentRequestsTrainer,AppointmentRequestsUser } from "../entities/appointmentEntity";
import { bookingSlot } from "../entities/bookingSlotEntity";
import { BookingSlotRepository } from "../interfaces/bookingSlotRepository";
import { AppointmentRepository } from "../interfaces/appointmentRepository";

export class BookingSlotUseCase {
  constructor(private bookingSlotRepository:BookingSlotRepository, private appointmentRepository:AppointmentRepository) {}

  public async addBookingSlot(data:CreateBookingSlot): Promise<bookingSlot> {

    const {date,...otherData} = data
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    console.log("coming",{data,...otherData})

    const createdSlotData = await this.bookingSlotRepository.addBookingSlot({date: new Date(date),...otherData})
    if(!createdSlotData){
      throw new validationError(HttpStatusMessages.FailedToCreateBookingSlot)
    }
    return createdSlotData
  }

  
  public async getAvailableSlots(data:IdDTO): Promise<bookingSlot[]> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const availableSlotData = await this.bookingSlotRepository.getAvailableSlots(data)
    if(!availableSlotData){
      throw new validationError(HttpStatusMessages.FailedToGetAvailableSlotData)
    }
    return availableSlotData
  }

  public async bookSlotAppointment(data:BookAppointment):Promise<appointment> {
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

    const bookingSlotId = bookingSlot._id
    const trainerId = bookingSlot.trainerId
    const appointmentDate = bookingSlot.date
    const appointmentTime = bookingSlot.time

    const appointmentData = await this.appointmentRepository.
                            createAppointment({bookingSlotId,trainerId,appointmentDate,appointmentTime,userId})

    const bookingSlotData = await this.bookingSlotRepository.findBookSlotAndChangeStatusTobooked(bookingSlot._id.toString())

    if(!appointmentData || !bookingSlotData) {
      throw new validationError(HttpStatusMessages.FailedToBookSlot)
    }
    return appointmentData
  }

  public async  getBookingRequests  (data:IdDTO):Promise<AppointmentRequestsTrainer[]> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const appointmentRequests = await this.appointmentRepository.getBookingAppointmentRequests(data)

    if(!appointmentRequests){
      throw new validationError(HttpStatusMessages.FailedToRetrieveBookingRequests)
    }
    return appointmentRequests
  }
  public async approveRejectBookingRequest  (data:approveRejectBookingRequest):Promise<appointment> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const bookingSlotData = await this.bookingSlotRepository.findSlotById(data.bookingSlotId)

    if(!bookingSlotData){
      throw new validationError(HttpStatusMessages.BookingSlotNotFound)
    }

    const {bookingSlotId,appointmentId,action} = data
    
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

  public async getBookingSchedulesForTrainer  (data:IdDTO):Promise<AppointmentRequestsTrainer[]> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const appointmentsList = await this.appointmentRepository.getAppointMentSchedulesForTrainer(data)

    if(!appointmentsList){
      throw new validationError(HttpStatusMessages.FailedToRetrieveBookingRequests)
    }
    return appointmentsList
  }
  public async cancelAppointmentSchedule (data:IdDTO):Promise<appointment> {
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

  public async getBookingSchedulesUser  (data:IdDTO):Promise<AppointmentRequestsUser[]> {
    if (!data) {
      throw new validationError(HttpStatusMessages.AllFieldsAreRequired);
    }
    const appointmentsList = await this.appointmentRepository.getAppointMentSchedulesUser(data)

    if(!appointmentsList){
      throw new validationError(HttpStatusMessages.FailedToRetrieveBookingRequests)
    }
    return appointmentsList
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

  

}