import { IVideoCallLogRepository } from "@domain/interfaces/IVideoCallLogRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ApplicationStatus } from "@shared/constants/index.constants";
import { GetTrainerVideoCallLogQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { TrainerVideoCallLog } from "@application/dtos/video-call-dtos";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { VideoCallStatus } from "@shared/constants/videocallStatus/videocall.status";
import { IGetTrainerVideoCallLogUC } from "@application/interfaces/usecases/IVideoCallLogUC";

/**
 * Purpose: Fetch video call logs for a trainer with pagination, filters, and date range.
 * Incoming: { trainerId, page, limit, fromDate, toDate, search, filters }
 * Returns: { trainerVideoCallLogList, paginationData }
 * Throws: Error if trainerId is missing or retrieval fails.
 */

@injectable()
export class GetTrainerVideoCallLogUseCase
  implements IGetTrainerVideoCallLogUC
{
  constructor(
    @inject(TYPES_REPOSITORIES.VideoCallLogRepository)
    private videoCallLogRepository: IVideoCallLogRepository
  ) {}

  async execute(
    { trainerId, page, limit, fromDate, toDate, search, filters }: GetTrainerVideoCallLogQueryDTO
  ): Promise<{
    trainerVideoCallLogList: TrainerVideoCallLog[];
    paginationData: PaginationDTO;
  }> {
    if (!trainerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }
    const query = { page, limit, fromDate, toDate, search, filters ,trainerId};
    const { trainerVideoCallLogList, paginationData } =
      await this.videoCallLogRepository.getTrainerVideoCallLogs(
        query
      );

    if (!trainerVideoCallLogList) {
      throw new validationError(VideoCallStatus.RetrieveFailed);
    }
    return { trainerVideoCallLogList, paginationData };
  }
}
