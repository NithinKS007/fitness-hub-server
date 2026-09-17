import { PaginationDTO } from "@application/dtos/utility-dtos";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import {
  AppointmentStatus,
  AuthStatus,
} from "@shared/constants/index.constants";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { GetTrainerSchedulesDTO } from "@application/dtos/query-dtos";
import { AppointmentRequestsTrainer } from "@application/dtos/appointment-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetTrainerSchedulesUC } from "@application/interfaces/usecases/IAppointmentUC";

/*  
    Purpose: Retrieve a list of booking schedules for a specific trainer with pagination and filters
    Incoming: { trainerId, page, limit, fromDate, toDate, search, filters } 
    (Trainer's ID, Query parameters for filtering)
    Returns: { trainerBookingSchedulesList, paginationData } (List of trainer's booking schedules and pagination details)
    Throws: Error if trainer ID is missing or booking schedules cannot be retrieved
*/

@injectable()
export class GetTrainerSchedulesUseCase implements IGetTrainerSchedulesUC {
  constructor(
    @inject(TYPES_REPOSITORIES.AppointmentRepository)
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(
    { trainerId, page, limit, fromDate, toDate, search, filters }: GetTrainerSchedulesDTO
  ): Promise<{
    trainerBookingSchedulesList: AppointmentRequestsTrainer[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { trainerId,page, limit, fromDate, toDate, search, filters };
    const { trainerBookingSchedulesList, paginationData } =
      await this.appointmentRepository.getTrainerSchedules(query);
    if (!trainerBookingSchedulesList) {
      throw new NotFoundError(AppointmentStatus.BookingRequestsFetchFailed);
    }
    return { trainerBookingSchedulesList, paginationData };
  }
}
