import mongoose from "mongoose";
import { AdminRevenueHistory, CreateRevenueDTO } from "../../../application/dtos/revenueDTOs";
import { RevenueRepository } from "../../../domain/interfaces/revenueRepository";
import revenueModel from "../models/revenueModel";
import { DateRangeQueryDTO, GetRevenueQueryDTO } from "../../../application/dtos/queryDTOs";
import { AdminChartData } from "../../../domain/entities/chartEntity";
import { PaginationDTO } from "../../../application/dtos/utilityDTOs";

export class MongoRevenueRepository implements RevenueRepository{
    public async create(data: CreateRevenueDTO): Promise<void> {

        const { subscriptionId,
                userSubscriptionPlanId,
                trainerId,
                userId,
                amountPaid,
                platformRevenue,
                trainerRevenue,
                commission
            } = data

        await revenueModel.create({
                                   subscriptionId:new mongoose.Types.ObjectId(subscriptionId),
                                   userSubscriptionPlanId:new mongoose.Types.ObjectId(userSubscriptionPlanId),
                                   trainerId:new mongoose.Types.ObjectId(trainerId),
                                   userId:new mongoose.Types.ObjectId(userId),
                                   amountPaid:amountPaid,
                                   platformRevenue:platformRevenue,
                                   trainerRevenue:trainerRevenue,
                                   commission:commission
                                  })
    }

    public async getTotalPlatFormFee(): Promise<number> {
        const totalPlatFormFee =  await revenueModel.aggregate([{$group:{_id:null,totalPlatFormFee:{$sum:"$platformRevenue"}}}])
        return totalPlatFormFee[0].totalPlatFormFee
    }

    public async getTotalCommission(): Promise<number> {
        const totalcommission =  await revenueModel.aggregate([{$group:{_id:null,totalCommission:{$sum:"$commission"}}}])
        return totalcommission[0].totalCommission
    }

    public async getTotalRevenue(): Promise<number> {
        const totalRevenue =  await revenueModel.aggregate([{$group:{_id:null,totalRevenue :{$sum:{$add:["$platformRevenue","$commission"]}}}}])
        return totalRevenue[0].totalRevenue
    }

    public async   getRevenueChartData(data:DateRangeQueryDTO):Promise<AdminChartData[]> {

       const {startDate,endDate} = data
       console.log("time range received",startDate,endDate)

       const result = await revenueModel.aggregate([
        {
            $match:{
                createdAt:{
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            $group:{
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                platformRevenue:{$sum:"$platformRevenue"},
                commission:{$sum:"$commission"},
                totalRevenue:{$sum:{$add:["$platformRevenue","$commission"]}}
            }
        },
        { $sort: { "_id": 1 } }
       ])

       console.log("result",result)

       return result
    }

    public async getFullRevenueData(data:GetRevenueQueryDTO): Promise<{revenueData:AdminRevenueHistory[],paginationData:PaginationDTO}> {
        
        const {search,page,limit,filters,fromDate,toDate} = data

        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        let matchQuery: any = {}

        if(data){

            if(search){
                matchQuery.$or = [
                    {"subscriptionProvidedBy.fname":{$regex:search,$options:"i"}},
                    {"subscriptionProvidedBy.lname":{$regex:search,$options:"i"}},
                    {"subscriptionProvidedBy.email":{$regex:search,$options:"i"}},
                    {"subscriptionTakenBy.fname":{$regex:search,$options:"i"}},
                    {"subscriptionTakenBy.lname":{$regex:search,$options:"i"}},
                    {"subscriptionTakenBy.email":{$regex:search,$options:"i"}},
                ]
            }
           
              if(filters && filters.length > 0 && !filters.includes("All")) {

                const conditions:any = []
                if (filters.includes("Active")) conditions.push({ "userSubscriptionPlanData.stripeSubscriptionStatus": "active" });
                if (filters.includes("Canceled")) conditions.push({ "userSubscriptionPlanData.stripeSubscriptionStatus": "canceled" });
                if (filters.includes("Incomplete")) conditions.push({ "userSubscriptionPlanData.stripeSubscriptionStatus": "incomplete" });
                if (filters.includes("Incomplete expired")) conditions.push({ "userSubscriptionPlanData.stripeSubscriptionStatus": "incomplete_expired" });
                if (filters.includes("Trialing")) conditions.push({ "userSubscriptionPlanData.stripeSubscriptionStatus": "trialing" });
                if (filters.includes("Past due")) conditions.push({ "userSubscriptionPlanData.stripeSubscriptionStatus": "past_due" });
                if (filters.includes("Unpaid")) conditions.push({ "userSubscriptionPlanData.stripeSubscriptionStatus": "unpaid" });
                if (filters.includes("Paused")) conditions.push({ "userSubscriptionPlanData.stripeSubscriptionStatus": "paused" });
                if (filters.includes("Monthly")) conditions.push({ "userSubscriptionPlanData.subPeriod": "monthly" });
                if (filters.includes("Quarterly")) conditions.push({ "userSubscriptionPlanData.subPeriod": "quarterly" });
                if (filters.includes("Yearly")) conditions.push({ "userSubscriptionPlanData.subPeriod": "yearly" });
                if (filters.includes("HalfYearly")) conditions.push({ "userSubscriptionPlanData.subPeriod": "halfYearly" });
                if (conditions.length > 0) matchQuery.$or = conditions;
              }

              if (fromDate && toDate) {
                matchQuery.createdAt = { $gte: fromDate, $lte: toDate };
              } else if (fromDate) {
                matchQuery.createdAt = { $gte: fromDate }
              } else if (toDate) {
                matchQuery.createdAt = { $lte: toDate };
              }
        }

        const [totalCount,revenueData] = await Promise.all([

            revenueModel.aggregate([
                {
                  $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "_id",
                    as: "trainerData",
                  },
                },
                {
                  $unwind: "$trainerData",
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "trainerData.userId",
                    foreignField: "_id",
                    as: "subscriptionProvidedBy",
                  },
                },
                { $unwind: "$subscriptionProvidedBy" },
                {
                    $lookup:{
                        from:"users",
                        localField:"userId",
                        foreignField:"_id",
                        as:"subscriptionTakenBy"
                    }
                },
                { $unwind: "$subscriptionTakenBy" },
                {
                    $lookup:{
                        from:"usersubscriptionplans",
                        localField:"userSubscriptionPlanId",
                        foreignField:"_id",
                        as:"userSubscriptionPlanData"
                    }
                },
                { $unwind: "$userSubscriptionPlanData" },
                { $match:matchQuery },
                { $count: "totalCount" },
               ]).then((result) => (result.length > 0 ? result[0].totalCount : 0)),
               revenueModel.aggregate([
                {
                  $lookup: {
                    from: "trainers",
                    localField: "trainerId",
                    foreignField: "_id",
                    as: "trainerData",
                  },
                },
                {
                  $unwind: "$trainerData",
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "trainerData.userId",
                    foreignField: "_id",
                    as: "subscriptionProvidedBy",
                  },
                },
                { $unwind: "$subscriptionProvidedBy" },
                {
                    $lookup:{
                        from:"users",
                        localField:"userId",
                        foreignField:"_id",
                        as:"subscriptionTakenBy"
                    }
                },
                { $unwind: "$subscriptionTakenBy" },
                {
                    $lookup:{
                        from:"usersubscriptionplans",
                        localField:"userSubscriptionPlanId",
                        foreignField:"_id",
                        as:"userSubscriptionPlanData"
                    }
                },
                { $unwind: "$userSubscriptionPlanData" },
                { $match:matchQuery },
                {
                    $project:{
                        amountPaid: 1,
                        commission: 1,
                        createdAt: 1,
                        platformRevenue: 1,
                        trainerRevenue: 1,
                        subscriptionId: 1,
                        userId: 1,
                        trainerId: 1,
                        userSubscriptionPlanId: 1,
                        subscriptionProvidedBy: {
                            email: "$subscriptionProvidedBy.email",
                            fname: "$subscriptionProvidedBy.fname",
                            lname: "$subscriptionProvidedBy.lname",
                            phone: "$subscriptionProvidedBy.phone",
                            profilePic: "$subscriptionProvidedBy.profilePic",
                          },
                        subscriptionTakenBy: {
                            email: "$subscriptionTakenBy.email",
                            fname: "$subscriptionTakenBy.fname",
                            lname: "$subscriptionTakenBy.lname",
                            phone: "$subscriptionTakenBy.phone",
                            profilePic: "$subscriptionTakenBy.profilePic",
                        },
                        subscriptionPlanData: {
                            stripeSubscriptionStatus: "$userSubscriptionPlanData.stripeSubscriptionStatus",
                            subPeriod: "$userSubscriptionPlanData.subPeriod",
                          },
                     }
                 }
    
             ])
             .sort({ createdAt: -1 })
             .skip(skip)
             .limit(limitNumber)
             .exec()
      
       
          ])

          const totalPages = Math.ceil(totalCount / limitNumber);
          return {
            revenueData:revenueData,
            paginationData: {
                currentPage: pageNumber,
                totalPages:totalPages,
              },
          }
    }
}