import {
  GetBookingRequestsDTO,
  GetTrainerSchedulesDTO,
  GetUserSchedulesDTO,
} from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { Appointment } from "@domain/entities/appointment.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IAppointment } from "@infrastructure/databases/models/appointment.model";
import {
  AppointmentsTRUILayer,
  AppointmentsURUILayer,
} from "@infrastructure/mappers/appointment.mapper";

export interface IAppointmentRepository
  extends IBaseRepository<IAppointment, Appointment> {
  getBookingRequests(
    dtos: GetBookingRequestsDTO
  ): Promise<PagedResponse<AppointmentsTRUILayer>>;
  getTrainerSchedules(
    dtos: GetTrainerSchedulesDTO
  ): Promise<PagedResponse<AppointmentsTRUILayer>>;
  getUserSchedules(
    dtos: GetUserSchedulesDTO
  ): Promise<PagedResponse<AppointmentsURUILayer>>;
}
