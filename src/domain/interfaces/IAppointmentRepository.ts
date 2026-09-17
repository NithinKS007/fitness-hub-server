import {
  AppointmentRequestsTrainer,
  AppointmentRequestsUser,
} from "@application/dtos/appointment-dtos";
import {
  GetBookingRequestsDTO,
  GetTrainerSchedulesDTO,
  GetUserSchedulesDTO,
} from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { Appointment } from "@domain/entities/appointment.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IAppointment } from "@infrastructure/databases/models/appointment.model";

export interface IAppointmentRepository
  extends IBaseRepository<IAppointment, Appointment> {
  getBookingRequests(dtos: GetBookingRequestsDTO): Promise<{
    bookingRequestsList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }>;
  getTrainerSchedules(dtos: GetTrainerSchedulesDTO): Promise<{
    trainerBookingSchedulesList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }>;
  getUserSchedules(dtos: GetUserSchedulesDTO): Promise<{
    appointmentList: AppointmentRequestsUser[];
    paginationData: PaginationDTO;
  }>;
}
