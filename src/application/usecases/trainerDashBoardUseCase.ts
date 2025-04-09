import { IdDTO } from "../dtos/utilityDTOs";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { UserSubscriptionPlanRepository } from "../../domain/interfaces/userSubscriptionRepository";
import { TrainerDashboardStats } from "../../domain/entities/trainerEntity";
import { DashBoardChartFilterDTO } from "../dtos/queryDTOs";
import { getDateRange } from "../../shared/utils/dayjs";

export class TrainerDashBoardUseCase {
    constructor (private userSubscriptionPlanRepository:UserSubscriptionPlanRepository) {}
    public async  getTrainerDashBoardData (trainerId:IdDTO,data:DashBoardChartFilterDTO):Promise< TrainerDashboardStats > {
        if(!trainerId){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }

        const [totalSubscribersCount,activeSubscribersCount,canceledSubscribersCount,chartData,pieChartData] = 
        await Promise.all([this.getTotalSubscriptionsCount(trainerId),this.getActiveSubscriptionsCount(trainerId)
            ,this.getCanceledSubscriptionCount(trainerId),this.getChartSubscriptionsData(trainerId,data),this.getPieChartSubscriptionsData(trainerId,data)])
            return {
                chartData,
                pieChartData,
                totalSubscribersCount,
                activeSubscribersCount,
                canceledSubscribersCount,
            }
    }

    private async  getTotalSubscriptionsCount (trainerId:IdDTO):Promise <number> {
        if(!trainerId){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        const totalSubscribers = await this.userSubscriptionPlanRepository.findAllTrainerSubscribers(trainerId)
        return totalSubscribers.length

    }

    private async getActiveSubscriptionsCount  (trainerId:IdDTO):Promise<number> {
        if(!trainerId){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        const activeTrainerSubscribers = await this.userSubscriptionPlanRepository.findAllActiveSubscribers(trainerId)
        return activeTrainerSubscribers.length
     
    }

    private async getCanceledSubscriptionCount(trainerId:IdDTO):Promise<number> {
        if(!trainerId){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }

        const canceledSubscribers = await this.userSubscriptionPlanRepository.findCanceledSubscribers(trainerId)
        return canceledSubscribers.length
    }

    private async getChartSubscriptionsData(trainerId:IdDTO,data:DashBoardChartFilterDTO):Promise<any>{

      const {startDate,endDate} = getDateRange(data)

      const chartData = await this.userSubscriptionPlanRepository.trainerChartDataFilter(trainerId,{startDate,endDate})

      if(!chartData){
        throw new validationError("Failed to retrieve chartdata")
      }

      return chartData
    }

    private async getPieChartSubscriptionsData(trainerId:IdDTO,data:DashBoardChartFilterDTO):Promise<any>{

      const {startDate,endDate} = getDateRange(data)

      const pieChartData = await this.userSubscriptionPlanRepository.trainerPieChartDataFilter(trainerId,{startDate,endDate})

      if(!pieChartData){
        throw new validationError("Failed to retrieve chartdata")
      }

      return pieChartData

    }

}