import { CustomUserDashBoardQueryDTO, DateRangeQueryDTO, GetTrainerSubscribersQueryDTO, GetUserSubscriptionsQueryDTO, UserDashBoardQueryDTO } from "../../application/dtos/queryDTOs";
import { CheckSubscriptionStatusDTO,CreateUserSubscriptionPlanDTO,UpdateSubscriptionStatusDTO } from "../../application/dtos/subscriptionDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { TrainerChartData, TrainerPieChartData } from "../entities/chartEntity";
import { MongoUserSubscriptionsList, MonogoTrainerSubscribersList, TrainerSubscribersList, UserSubscriptionsList } from "../entities/subscriptionEntity";
import { Top5List } from "../entities/trainerEntity";
import { SubscriptionPlanEntity } from "../entities/userSubscriptionPlanEntity";

export interface UserSubscriptionPlanRepository {
    create(data:CreateUserSubscriptionPlanDTO):Promise<SubscriptionPlanEntity>
    findSubscriptionsOfUser(_id:IdDTO,data:GetUserSubscriptionsQueryDTO):Promise<{mongoUserSubscriptionsList: MongoUserSubscriptionsList[] ,paginationData:PaginationDTO}>
    findSubscriptionsOfTrainer(_id:IdDTO,data:GetTrainerSubscribersQueryDTO):Promise<{mongoTrainerSubscribers:MonogoTrainerSubscribersList[] ,paginationData:PaginationDTO}>
    findSubscriptionByStripeSubscriptionId(data:IdDTO):Promise<SubscriptionPlanEntity>
    findSubscriptionsOfUserwithUserIdAndTrainerId(data:CheckSubscriptionStatusDTO):Promise<SubscriptionPlanEntity[] | null>
    findSubscriptionByStripeSubscriptionIdAndUpdateStatus(data:UpdateSubscriptionStatusDTO):Promise<SubscriptionPlanEntity | null>
    findAllTrainerSubscribers(data:IdDTO):Promise<MonogoTrainerSubscribersList[]>
    findAllActiveSubscribers(data:IdDTO):Promise<MonogoTrainerSubscribersList[]>
    findCanceledSubscribers(data:IdDTO):Promise<MonogoTrainerSubscribersList[]>
    trainerChartDataFilter(trainerId:IdDTO,data:DateRangeQueryDTO):Promise<TrainerChartData[]>
    trainerPieChartDataFilter(trainerId:IdDTO,data:DateRangeQueryDTO):Promise<TrainerPieChartData[]>
    findTrainerChatList(trainerId:IdDTO):Promise<TrainerSubscribersList[]>
    findUserChatList(userId:IdDTO):Promise<UserSubscriptionsList[]>
    findTop5TrainersWithHighestSubscribers():Promise<Top5List[]>
}