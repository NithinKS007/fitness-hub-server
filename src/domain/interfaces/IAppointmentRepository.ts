import {
  GetBookingRequestsDTO,
  GetBookingSchedulesDTO,
} from "../../application/dtos/query-dtos";
import { PaginationDTO } from "../../application/dtos/utility-dtos";
import { IAppointment } from "../../infrastructure/databases/models/appointment.model";
import {
  AppointmentRequestsTrainer,
  AppointmentRequestsUser,
} from "../entities/appointment.entities";
import { IBaseRepository } from "./IBaseRepository";

export interface IAppointmentRepository extends IBaseRepository<IAppointment> {
  getBookingRequests(
    trainerId: string,
    searchFilterQuery: GetBookingRequestsDTO
  ): Promise<{
    bookingRequestsList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }>;
  getTrainerSchedules(
    trainerId: string,
    searchFilterQuery: GetBookingSchedulesDTO
  ): Promise<{
    trainerBookingSchedulesList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }>;
  getUserSchedules(
    userId: string,
    searchFilterQuery: GetBookingSchedulesDTO
  ): Promise<{
    appointmentList: AppointmentRequestsUser[];
    paginationData: PaginationDTO;
  }>;
}
