import { IdDTO } from "../dtos/utilityDTOs";
import stripe from "../../infrastructure/config/stripeConfig";
import { validationError } from "../../interfaces/middlewares/errorMiddleWare";
import { HttpStatusMessages } from "../../shared/constants/httpResponseStructure";
import { UserSubscriptionPlanRepository } from "../../domain/interfaces/userSubscriptionRepository";
import { TrainerDashboardStats } from "../../domain/entities/trainerEntity";
import { DashBoardChartFilterDTO } from "../dtos/queryDTOs";
import dayjs from "dayjs";

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
        const trainerSubscribers = await Promise.all(totalSubscribers.map(async (sub) => {
            const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
            const stripeData = {
              startDate: new Date(stripeSub.current_period_start * 1000).toISOString().split("T")[0],
              endDate: new Date(stripeSub.current_period_end * 1000).toISOString().split("T")[0],
              isActive: stripeSub.status,
              stripeSubscriptionStatus: stripeSub.status
            }
            return {
              ...sub, 
              ...stripeData,
            };
          }))

          return trainerSubscribers.length

    }

    private async getActiveSubscriptionsCount  (trainerId:IdDTO):Promise<number> {
        if(!trainerId){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }
        const activeTrainerSubscribers = await this.userSubscriptionPlanRepository.findAllActiveSubscribers(trainerId)
        const trainerSubscribers = await Promise.all(activeTrainerSubscribers.map(async (sub) => {
            const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
            const stripeData = {
              startDate: new Date(stripeSub.current_period_start * 1000).toISOString().split("T")[0],
              endDate: new Date(stripeSub.current_period_end * 1000).toISOString().split("T")[0],
              isActive: stripeSub.status,
              stripeSubscriptionStatus: stripeSub.status
            }

            return {
              ...sub, 
              ...stripeData,
            };
          }))

          return trainerSubscribers.length
     
    }

    private async getCanceledSubscriptionCount(trainerId:IdDTO):Promise<number> {
        if(!trainerId){
            throw new validationError(HttpStatusMessages.AllFieldsAreRequired)
        }

        const canceledSubscribers = await this.userSubscriptionPlanRepository.findCanceledSubscribers(trainerId)
        const trainerSubscribers = await Promise.all(canceledSubscribers.map(async (sub) => {
            const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
            const stripeData = {
              startDate: new Date(stripeSub.current_period_start * 1000).toISOString().split("T")[0],
              endDate: new Date(stripeSub.current_period_end * 1000).toISOString().split("T")[0],
              isActive: stripeSub.status,
              stripeSubscriptionStatus: stripeSub.status
            }

            return {
              ...sub, 
              ...stripeData,
            };
          }))

          return trainerSubscribers.length
    }

    private async getChartSubscriptionsData(trainerId:IdDTO,data:DashBoardChartFilterDTO):Promise<any>{

      console.log("hello data",data)
      let startDate = dayjs().startOf('month').toDate();
      let endDate = dayjs().endOf('month').toDate();
      switch (data) {
        case "Today":
          startDate = dayjs().startOf('day').toDate();
          endDate = dayjs().endOf('day').toDate();
          break;
        case "This week":
          startDate = dayjs().startOf('week').toDate();
          endDate = dayjs().endOf('week').toDate();
          break;
        case "This month":
          startDate = dayjs().startOf('month').toDate();
          endDate = dayjs().endOf('month').toDate();
          break;
        case "This year":
          startDate = dayjs().startOf('year').toDate();
          endDate = dayjs().endOf('year').toDate();
          break;
        default:
          break;
      }
      
       const chartData = await this.userSubscriptionPlanRepository.trainerChartDataFilter(trainerId,{startDate,endDate})

       console.log("chart data",chartData)
       if(!chartData){
          throw new validationError("Failed to retrieve chartdata")
       }

       return chartData
    }

    private async getPieChartSubscriptionsData(trainerId:IdDTO,data:DashBoardChartFilterDTO):Promise<any>{

      let startDate = dayjs().startOf('month').toDate();
      let endDate = dayjs().endOf('month').toDate();
      switch (data) {
        case "Today":
          startDate = dayjs().startOf('day').toDate();
          endDate = dayjs().endOf('day').toDate();
          break;
        case "This week":
          startDate = dayjs().startOf('week').toDate();
          endDate = dayjs().endOf('week').toDate();
          break;
        case "This month":
          startDate = dayjs().startOf('month').toDate();
          endDate = dayjs().endOf('month').toDate();
          break;
        case "This year":
          startDate = dayjs().startOf('year').toDate();
          endDate = dayjs().endOf('year').toDate();
          break;
        default:
          break;
      }

      const pieChartData = await this.userSubscriptionPlanRepository.trainerPieChartDataFilter(trainerId,{startDate,endDate})

       if(!pieChartData){
          throw new validationError("Failed to retrieve chartdata")
       }

       return pieChartData

    }

}