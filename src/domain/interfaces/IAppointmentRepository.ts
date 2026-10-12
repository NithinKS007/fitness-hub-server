import {
  GetBookingRequestsDTO,
  GetTrainerSchedulesDTO,
  GetUserSchedulesDTO,
} from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { Appointment } from "@domain/entities/appointment.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import {
  AppointmentsTRUILayer,
  AppointmentsURUILayer,
} from "@application/dtos/read-models";

export interface IAppointmentRepository
  extends IBaseRepository<Appointment> {
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
