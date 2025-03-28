import { CreateVideoCallLogDTO,UpdateVideoCallLogDTO,UpdateVideoCallDurationDTO } from "../../application/dtos/chatDTOs";
import { GetVideoCallLogQueryDTO } from "../../application/dtos/queryDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { TrainerVideoCallLog, UserVideoCallLog, VideoCallLog } from "../entities/videoCallLogEntity";

export interface VideoCallLogRepository {
    createCallLog(data:CreateVideoCallLogDTO):Promise<void>
    updateVideoCallLog(data:UpdateVideoCallLogDTO):Promise<VideoCallLog>
    updateVideoCallDuration(data:UpdateVideoCallDurationDTO):Promise<void>
    getTrainerVideoCallLogs(_id:IdDTO,data:GetVideoCallLogQueryDTO):Promise<{trainerVideoCallLogList: TrainerVideoCallLog[],paginationData:PaginationDTO}>
    getUserVideoCallLogs(_id:IdDTO,data:GetVideoCallLogQueryDTO):Promise<{userVideoCallLogList: UserVideoCallLog[],paginationData:PaginationDTO}>
}