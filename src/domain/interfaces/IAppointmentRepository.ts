import {
  AppointmentRequestsTrainer,
  AppointmentRequestsUser,
} from "@application/dtos/appointment-dtos";
import {
  GetBookingRequestsDTO,
  GetBookingSchedulesDTO,
} from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IAppointment } from "@domain/entities/appointment.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

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
