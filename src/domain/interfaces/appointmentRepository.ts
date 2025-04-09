import { HandleBookingRequestDTO,CreateAppointmentDTO } from "../../application/dtos/bookingDTOs";
import { GetBookingRequestsDTO, GetBookingSchedulesDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { Appointment, AppointmentRequestsTrainer, AppointmentRequestsUser } from "../entities/appointmentEntity";

export interface AppointmentRepository {
    createAppointment(data:CreateAppointmentDTO):Promise<Appointment>
    getBookingAppointmentRequests(_id:IdDTO,data:GetBookingRequestsDTO):Promise<{bookingRequestsList:AppointmentRequestsTrainer[],paginationData:PaginationDTO}>
    approveOrRejectAppointment(data:HandleBookingRequestDTO):Promise<Appointment|null>
    getTrainerBookingSchedules(_id:IdDTO,data:GetBookingSchedulesDTO):Promise<{trainerBookingSchedulesList: AppointmentRequestsTrainer[],paginationData:PaginationDTO}>
    cancelAppointmentSchedule(data:IdDTO):Promise<Appointment | null>
    getUserBookingSchedules(_id:IdDTO,data:GetBookingSchedulesDTO):Promise<{appointmentList:AppointmentRequestsUser[],paginationData:PaginationDTO}>
    getAppointmentById(data:IdDTO):Promise<Appointment | null>
}