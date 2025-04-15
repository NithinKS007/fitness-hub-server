import { HandleBookingRequestDTO,CreateAppointmentDTO } from "../../application/dtos/bookingDTOs";
import { GetBookingRequestsDTO, GetBookingSchedulesDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { Appointment, AppointmentRequestsTrainer, AppointmentRequestsUser } from "../entities/appointmentEntity";

export interface IAppointmentRepository {
    createAppointment(appointmentData:CreateAppointmentDTO):Promise<Appointment>
    getBookingAppointmentRequests(trainerId:IdDTO,searchFilterQuery:GetBookingRequestsDTO):Promise<{bookingRequestsList:AppointmentRequestsTrainer[],paginationData:PaginationDTO}>
    approveOrRejectAppointment(handleBookingRequest:HandleBookingRequestDTO):Promise<Appointment|null>
    getTrainerBookingSchedules(trainerId:IdDTO,searchFilterQuery:GetBookingSchedulesDTO):Promise<{trainerBookingSchedulesList: AppointmentRequestsTrainer[],paginationData:PaginationDTO}>
    cancelAppointmentSchedule(appointmentId:IdDTO):Promise<Appointment | null>
    getUserBookingSchedules(userId:IdDTO,searchFilterQuery:GetBookingSchedulesDTO):Promise<{appointmentList:AppointmentRequestsUser[],paginationData:PaginationDTO}>
    getAppointmentById(appointmentId:IdDTO):Promise<Appointment | null>
}