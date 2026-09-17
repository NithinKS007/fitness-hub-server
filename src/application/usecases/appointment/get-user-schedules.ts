import { PaginationDTO } from "@application/dtos/utility-dtos";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import {
  AppointmentStatus,
  AuthStatus,
} from "@shared/constants/index.constants";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { GetUserSchedulesDTO } from "@application/dtos/query-dtos";
import { AppointmentRequestsUser } from "@application/dtos/appointment-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetUserSchedulesUC } from "@application/interfaces/usecases/IAppointmentUC";

/*  
    Purpose: Retrieve a list of booking schedules for a specific user with pagination and filters
    Incoming: { userId, page, limit, fromDate, toDate, search, filters } (User's ID and query parameters for filtering)
    Returns: { appointmentList, paginationData } (List of user's booking schedules and pagination details)
    Throws: Error if user ID is missing or booking schedules cannot be retrieved
*/

@injectable()
export class GetUserSchedulesUseCase implements IGetUserSchedulesUC {
  constructor(
    @inject(TYPES_REPOSITORIES.AppointmentRepository)
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(
    { userId, page, limit, fromDate, toDate, search, filters }: GetUserSchedulesDTO
  )
  : Promise<{
    appointmentList: AppointmentRequestsUser[];
    paginationData: PaginationDTO;
  }> {
    if (!userId) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const query = { userId, page, limit, fromDate, toDate, search, filters };
    const { appointmentList, paginationData } =
      await this.appointmentRepository.getUserSchedules(query);
    if (!appointmentList) {
      throw new NotFoundError(AppointmentStatus.BookingRequestsFetchFailed);
    }
    return { appointmentList, paginationData };
  }
}
