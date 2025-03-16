import { approveRejectBookingRequest, CreateAppointment, IdDTO } from "../../application/dtos";
import { appointment, AppointmentRequestsTrainer, AppointmentRequestsUser } from "../entities/appointmentEntity";

export interface AppointmentRepository {
    createAppointment(data:CreateAppointment):Promise<appointment>
    getBookingAppointmentRequests(data:IdDTO):Promise<AppointmentRequestsTrainer[]>
    approveOrRejectAppointment(data:approveRejectBookingRequest):Promise<appointment|null>
    getAppointMentSchedulesForTrainer(data:IdDTO):Promise<AppointmentRequestsTrainer[]>
    cancelAppointmentSchedule(data:IdDTO):Promise<appointment | null>
    getAppointMentSchedulesUser(data:IdDTO):Promise<AppointmentRequestsUser[]>
}