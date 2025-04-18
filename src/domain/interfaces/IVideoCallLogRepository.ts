import { CreateVideoCallLogDTO,UpdateVideoCallLogDTO,UpdateVideoCallDurationDTO } from "../../application/dtos/videoCallDTOs";
import { GetVideoCallLogQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { TrainerVideoCallLog, UserVideoCallLog, VideoCallLog } from "../entities/videoCallLogEntity";

export interface IVideoCallLogRepository {
    createCallLog(data:CreateVideoCallLogDTO):Promise<void>
    updateVideoCallLog(data:UpdateVideoCallLogDTO):Promise<VideoCallLog>
    updateVideoCallDuration(data:UpdateVideoCallDurationDTO):Promise<void>
    getTrainerVideoCallLogs(trainerId:IdDTO,videoCallLogQuery:GetVideoCallLogQueryDTO):Promise<{trainerVideoCallLogList: TrainerVideoCallLog[],paginationData:PaginationDTO}>
    getUserVideoCallLogs(userId:IdDTO,videoCallLogQuery:GetVideoCallLogQueryDTO):Promise<{userVideoCallLogList: UserVideoCallLog[],paginationData:PaginationDTO}>
}