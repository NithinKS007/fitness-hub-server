import {
  CreateVideoCallLogDTO,
  UpdateVideoCallLogDTO,
  UpdateVideoCallDurationDTO,
} from "../../application/dtos/video-call-dtos";
import { GetVideoCallLogQueryDTO } from "../../application/dtos/query-dtos";
import { IdDTO, PaginationDTO } from "../../application/dtos/utility-dtos";
import {
  TrainerVideoCallLog,
  UserVideoCallLog,
  VideoCallLog,
} from "../entities/videoCallLog";

export interface IVideoCallLogRepository {
  createCallLog(data: CreateVideoCallLogDTO): Promise<void>;
  updateVideoCallLog(data: UpdateVideoCallLogDTO): Promise<VideoCallLog>;
  updateVideoCallDuration(data: UpdateVideoCallDurationDTO): Promise<void>;
  getTrainerVideoCallLogs(
    trainerId: IdDTO,
    videoCallLogQuery: GetVideoCallLogQueryDTO
  ): Promise<{
    trainerVideoCallLogList: TrainerVideoCallLog[];
    paginationData: PaginationDTO;
  }>;
  getUserVideoCallLogs(
    userId: IdDTO,
    videoCallLogQuery: GetVideoCallLogQueryDTO
  ): Promise<{
    userVideoCallLogList: UserVideoCallLog[];
    paginationData: PaginationDTO;
  }>;
}
