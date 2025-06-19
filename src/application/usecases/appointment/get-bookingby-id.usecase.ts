import { validationError } from "@presentation/middlewares/error.middleware";
import {
  ApplicationStatus,
  AppointmentStatus,
} from "@shared/constants/index.constants";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IAppointment } from "@domain/entities/appointment.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "di/types-repositories";

/*  
    Purpose: Retrieve an appointment by its ID
    Incoming: { appointmentId } (ID of the appointment to retrieve)
    Returns: { appointmentData } (Appointment details if found)
    Throws: Error if appointment ID is missing or appointment is not found
*/

@injectable()
export class GetAppointmentByIdUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.AppointmentRepository)
    private appointmentRepository: IAppointmentRepository
  ) {}
  
  async execute(appointmentId: string): Promise<IAppointment | null> {
    if (!appointmentId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const appointmentData = await this.appointmentRepository.findById(
      appointmentId
    );
    if (!appointmentData) {
      throw new validationError(AppointmentStatus.FailedToFindAppointment);
    }
    return appointmentData;
  }
}
