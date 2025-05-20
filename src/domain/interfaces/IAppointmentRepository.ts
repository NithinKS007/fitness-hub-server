import {
  HandleBookingRequestDTO,
  CreateAppointmentDTO,
} from "../../application/dtos/booking-dtos";
import {
  GetBookingRequestsDTO,
  GetBookingSchedulesDTO,
} from "../../application/dtos/query-dtos";
import { IdDTO, PaginationDTO } from "../../application/dtos/utility-dtos";
import {
  Appointment,
  AppointmentRequestsTrainer,
  AppointmentRequestsUser,
} from "../entities/appointment";

export interface IAppointmentRepository {
  createAppointment(
    appointmentData: CreateAppointmentDTO
  ): Promise<Appointment>;
  getBookingAppointmentRequests(
    trainerId: IdDTO,
    searchFilterQuery: GetBookingRequestsDTO
  ): Promise<{
    bookingRequestsList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }>;
  approveOrRejectAppointment(
    handleBookingRequest: HandleBookingRequestDTO
  ): Promise<Appointment | null>;
  getTrainerBookingSchedules(
    trainerId: IdDTO,
    searchFilterQuery: GetBookingSchedulesDTO
  ): Promise<{
    trainerBookingSchedulesList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }>;
  cancelAppointmentSchedule(appointmentId: IdDTO): Promise<Appointment | null>;
  getUserBookingSchedules(
    userId: IdDTO,
    searchFilterQuery: GetBookingSchedulesDTO
  ): Promise<{
    appointmentList: AppointmentRequestsUser[];
    paginationData: PaginationDTO;
  }>;
  getAppointmentById(appointmentId: IdDTO): Promise<Appointment | null>;
}
