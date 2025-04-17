import { CustomUserDashBoardQueryDTO, DateRangeQueryDTO, GetTrainerSubscribersQueryDTO, GetUserSubscriptionsQueryDTO, GetUserTrainersListQueryDTO, UserDashBoardQueryDTO } from "../../application/dtos/queryDTOs";
import { CheckSubscriptionStatusDTO,CreateUserSubscriptionPlanDTO,UpdateSubscriptionStatusDTO } from "../../application/dtos/subscriptionDTOs";
import { IdDTO, PaginationDTO } from "../../application/dtos/utilityDTOs";
import { TrainerChartData, TrainerPieChartData } from "../entities/chartEntity";
import { MongoUserSubscriptionsList, MonogoTrainerSubscribersList, TrainerSubscribersList, UserSubscriptionsList } from "../entities/subscriptionEntity";
import { Top5List } from "../entities/trainerEntity";
import { SubscriptionPlanEntity } from "../entities/userSubscriptionPlanEntity";

export interface IUserSubscriptionPlanRepository {
    create(createUserSubscription:CreateUserSubscriptionPlanDTO):Promise<SubscriptionPlanEntity>
    findSubscriptionsOfUser(userId:IdDTO,searchFilterQuery:GetUserSubscriptionsQueryDTO):Promise<{mongoUserSubscriptionsList: MongoUserSubscriptionsList[] ,paginationData:PaginationDTO}>
    findSubscriptionsOfTrainer(trainerId:IdDTO,searchFilterQuery:GetTrainerSubscribersQueryDTO):Promise<{mongoTrainerSubscribers:MonogoTrainerSubscribersList[] ,paginationData:PaginationDTO}>
    findSubscriptionByStripeSubscriptionId(stripeSubscriptionId:IdDTO):Promise<SubscriptionPlanEntity>
    findSubscriptionsOfUserwithUserIdAndTrainerId(data:CheckSubscriptionStatusDTO):Promise<SubscriptionPlanEntity[] | null>
    findSubscriptionByStripeSubscriptionIdAndUpdateStatus(updateSubscriptionStatus:UpdateSubscriptionStatusDTO):Promise<SubscriptionPlanEntity | null>
    countAllTrainerSubscribers(trainerId:IdDTO):Promise<number>
    countAllActiveSubscribers(trainerId:IdDTO):Promise<number>
    countCanceledSubscribers(trainerId:IdDTO):Promise<number>
    trainerChartDataFilter(trainerId:IdDTO,dateFilterQuery:DateRangeQueryDTO):Promise<TrainerChartData[]>
    trainerPieChartDataFilter(trainerId:IdDTO,dateFilterQuery:DateRangeQueryDTO):Promise<TrainerPieChartData[]>
    // findTrainerChatList(trainerId:IdDTO):Promise<TrainerSubscribersList[]>
    // findUserChatList(userId:IdDTO):Promise<UserSubscriptionsList[]>
    findTop5TrainersWithHighestSubscribers():Promise<Top5List[]>
    usersMyTrainersList(userId:IdDTO,searchFilterQuery:GetUserTrainersListQueryDTO):Promise<{userTrainersList:MongoUserSubscriptionsList[] ,paginationData:PaginationDTO}>
}