import {
  HandleBookingRequestDTO,
  CreateAppointmentDTO,
} from "../../application/dtos/booking-dtos";
import {
  GetBookingRequestsDTO,
  GetBookingSchedulesDTO,
} from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { IAppointment } from "../../infrastructure/databases/models/appointment.model";
import {
  Appointment,
  AppointmentRequestsTrainer,
  AppointmentRequestsUser,
} from "../entities/appointment.entities";
import { IBaseRepository } from "./IBaseRepository";

export interface IAppointmentRepository extends IBaseRepository<IAppointment> {
  createAppointment(
    appointmentData: CreateAppointmentDTO
  ): Promise<Appointment>;
  getBookingAppointmentRequests(
    trainerId: string,
    searchFilterQuery: GetBookingRequestsDTO
  ): Promise<{
    bookingRequestsList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }>;
  handleBookingRequest(
    handleBookingRequest: HandleBookingRequestDTO
  ): Promise<Appointment | null>;
  getTrainerSchedules(
    trainerId: string,
    searchFilterQuery: GetBookingSchedulesDTO
  ): Promise<{
    trainerBookingSchedulesList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }>;
  cancelAppointmentSchedule(appointmentId: string): Promise<Appointment | null>;
  getUserSchedules(
    userId: string,
    searchFilterQuery: GetBookingSchedulesDTO
  ): Promise<{
    appointmentList: AppointmentRequestsUser[];
    paginationData: PaginationDTO;
  }>;
  getAppointmentById(appointmentId: string): Promise<Appointment | null>;
}
