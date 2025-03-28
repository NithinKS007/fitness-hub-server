import mongoose from "mongoose";
import { CheckSubscriptionStatusDTO,CreateUserSubscriptionPlanDTO,UpdateSubscriptionStatusDTO } from "../../../application/dtos/subscriptionDTOs";
import { IdDTO, PaginationDTO } from "../../../application/dtos/utilityDTOs";
import { SubscriptionPlanEntity } from "../../../domain/entities/userSubscriptionPlanEntity";
import { UserSubscriptionPlanRepository } from "../../../domain/interfaces/userSubscriptionRepository";
import userSubscriptionPlanModel from "../models/userSubscriptionPlan";
import { DateRangeQueryDTO, GetTrainerSubscribersQueryDTO, GetUserSubscriptionsQueryDTO } from "../../../application/dtos/queryDTOs";
import { MongoUserSubscriptionsList, MonogoTrainerSubscribersList } from "../../../domain/entities/subscriptionEntity";

export class MonogUserSubscriptionPlanRepository implements UserSubscriptionPlanRepository {
  public async create( data: CreateUserSubscriptionPlanDTO ): Promise<SubscriptionPlanEntity> {
    const {
      userId,
      trainerId,
      subPeriod,
      price,
      durationInWeeks,
      sessionsPerWeek,
      totalSessions,
      stripePriceId,
      stripeSubscriptionId,
      stripeSubscriptionStatus
      
    } = data;
    const newSubscription = await userSubscriptionPlanModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      trainerId: new mongoose.Types.ObjectId(trainerId),
      subPeriod,
      price,
      durationInWeeks,
      sessionsPerWeek,
      totalSessions,
      stripePriceId,
      stripeSubscriptionId,
      stripeSubscriptionStatus
    })

    return newSubscription.toObject()
  }
  public async findSubscriptionsOfUser(_id:IdDTO,data:GetUserSubscriptionsQueryDTO): Promise<{mongoUserSubscriptionsList: MongoUserSubscriptionsList[] ,paginationData:PaginationDTO}> {

    console.log("data received",data)
    const { page,limit,search,filters } = data
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let matchQuery:any = {}
    if(data){
      if(search){
          matchQuery.$or = [
            {"subscribedTrainerData.fname":{$regex:search,$options:"i"}},
            {"subscribedTrainerData.lname":{$regex:search,$options:"i"}},
            {"subscribedTrainerData.email":{$regex:search,$options:"i"}}
          ]
      }

      if(filters && filters.length > 0 && !filters.includes("All")){
          const conditions:any = []
          if (filters.includes("Active")) conditions.push({ stripeSubscriptionStatus: "active" });
          if (filters.includes("Canceled")) conditions.push({ stripeSubscriptionStatus: "canceled" });
          if (filters.includes("Incomplete")) conditions.push({ stripeSubscriptionStatus: "incomplete" });
          if (filters.includes("Incomplete expired")) conditions.push({ stripeSubscriptionStatus: "incomplete_expired" });
          if (filters.includes("Trialing")) conditions.push({ stripeSubscriptionStatus: "trialing" });
          if (filters.includes("Past due")) conditions.push({ stripeSubscriptionStatus: "past_due" });
          if (filters.includes("Unpaid")) conditions.push({ stripeSubscriptionStatus: "unpaid" });
          if (filters.includes("Paused")) conditions.push({ stripeSubscriptionStatus: "paused" });
          if (filters.includes("Monthly")) conditions.push({ subPeriod: "monthly" });
          if (filters.includes("Quarterly")) conditions.push({ subPeriod: "quarterly" });
          if (filters.includes("Yearly")) conditions.push({ subPeriod: "yearly" });
          if (filters.includes("HalfYearly")) conditions.push({ subPeriod: "halfYearly" });
          if (conditions.length > 0) matchQuery.$or = conditions;
      }
    }
    const [totalCount, userSubscriptionsList] = await Promise.all([
      userSubscriptionPlanModel.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(_id) } },
        {
          $lookup: {
            from: "trainers",
            localField: "trainerId",
            foreignField: "_id",
            as: "subscribedTrainerData",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "subscribedTrainerData.userId",
            foreignField: "_id",
            as: "subscribedTrainerData",
          },
        },
        { $match: matchQuery },
        { $unwind: "$subscribedTrainerData" },
      { $count: "totalCount" },
    ]).then((result) => (result.length > 0 ? result[0].totalCount : 0)),
    userSubscriptionPlanModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: "trainers",
          localField: "trainerId",
          foreignField: "_id",
          as: "subscribedTrainerData",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscribedTrainerData.userId",
          foreignField: "_id",
          as: "subscribedTrainerData",
        },
      },
      { $match: matchQuery },
      { $unwind: "$subscribedTrainerData" },
      {
        $project: {
          _id: 1,
          durationInWeeks: 1,
          price: 1,
          sessionsPerWeek: 1,
          stripePriceId: 1,
          stripeSubscriptionId: 1,
          stripeSubscriptionStatus:1,
          subPeriod: 1,
          totalSessions: 1,
          trainerId: 1,
          userId: 1,
          subscribedTrainerData: {
            _id:1,
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked:1
          },
        },
      }
    ]).sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .exec()
  ])

  console.log("hello usersusbs",userSubscriptionsList)
  
  const totalPages = Math.ceil(totalCount / limitNumber);
  return {
    mongoUserSubscriptionsList:userSubscriptionsList,
    paginationData: {
      currentPage: pageNumber,
      totalPages:totalPages,
    },
  };


  }
  public async findSubscriptionsOfTrainer(_id:IdDTO,data:GetTrainerSubscribersQueryDTO): Promise<{mongoTrainerSubscribers:MonogoTrainerSubscribersList[] ,paginationData:PaginationDTO}> {
        console.log("data",_id,data)

        const { page,limit,search,filters } = data
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        let matchQuery:any = {}

        if(data){
          if(search){
              matchQuery.$or = [
                {"subscribedUserData.fname":{$regex:search,$options:"i"}},
                {"subscribedUserData.lname":{$regex:search,$options:"i"}},
                {"subscribedUserData.email":{$regex:search,$options:"i"}}
              ]
          }

          if(filters && filters.length > 0 && !filters.includes("All")){
              const conditions:any = []
              if (filters.includes("Active")) conditions.push({ stripeSubscriptionStatus: "active" });
              if (filters.includes("Canceled")) conditions.push({ stripeSubscriptionStatus: "canceled" });
              if (filters.includes("Incomplete")) conditions.push({ stripeSubscriptionStatus: "incomplete" });
              if (filters.includes("Incomplete expired")) conditions.push({ stripeSubscriptionStatus: "incomplete_expired" });
              if (filters.includes("Trialing")) conditions.push({ stripeSubscriptionStatus: "trialing" });
              if (filters.includes("Past due")) conditions.push({ stripeSubscriptionStatus: "past_due" });
              if (filters.includes("Unpaid")) conditions.push({ stripeSubscriptionStatus: "unpaid" });
              if (filters.includes("Paused")) conditions.push({ stripeSubscriptionStatus: "paused" });
              if (filters.includes("Monthly")) conditions.push({ subPeriod: "monthly" });
              if (filters.includes("Quarterly")) conditions.push({ subPeriod: "quarterly" });
              if (filters.includes("Yearly")) conditions.push({ subPeriod: "yearly" });
              if (filters.includes("HalfYearly")) conditions.push({ subPeriod: "halfYearly" });
              if (conditions.length > 0) matchQuery.$or = conditions;
          }
        }

        const [totalCount, trainerSubscribers] = await Promise.all([
          userSubscriptionPlanModel.aggregate([
            { $match: { trainerId: new mongoose.Types.ObjectId(_id) } },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "subscribedUserData",
              },
            },
            { $match: matchQuery },
            { $unwind: "$subscribedUserData" },
            { $count: "totalCount" },
          ]).then((result) => (result.length > 0 ? result[0].totalCount : 0)),
        
          userSubscriptionPlanModel.aggregate([
            { $match: { trainerId: new mongoose.Types.ObjectId(_id) } },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "subscribedUserData",
              },
            },
            { $match: matchQuery },
            { $unwind: "$subscribedUserData" },
            {
              $project: {
                _id: 1,
                durationInWeeks: 1,
                price: 1,
                sessionsPerWeek: 1,
                stripePriceId: 1,
                stripeSubscriptionStatus: 1,
                stripeSubscriptionId: 1,
                subPeriod: 1,
                totalSessions: 1,
                trainerId: 1,
                userId: 1,
                subscribedUserData: {
                  _id: 1,
                  fname: 1,
                  lname: 1,
                  email: 1,
                  profilePic: 1,
                  isBlocked: 1,
                },
              },
            },
          ]).sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNumber)
          .exec()
        ]);
    
    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      mongoTrainerSubscribers:trainerSubscribers,
      paginationData: {
        currentPage: pageNumber,
        totalPages:totalPages,
      },
    };
     
  }
  public async findSubscriptionByStripeSubscriptionId(data: IdDTO): Promise<SubscriptionPlanEntity> {
    const result = await userSubscriptionPlanModel.aggregate([
      { $match: { stripeSubscriptionId: data} },
      {
        $lookup: {
          from: "users",
          localField: "trainerId",
          foreignField: "_id",
          as: "subscribedTrainerData",
        },
      },
      { $unwind: "$subscribedTrainerData" },
      {
        $project: {
          _id: 1,
          durationInWeeks: 1,
          price: 1,
          sessionsPerWeek: 1,
          stripePriceId: 1,
          stripeSubscriptionId: 1,
          subPeriod: 1,
          totalSessions: 1,
          trainerId: 1,
          userId: 1,
          subscribedTrainerData: {
            _id:1,
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked:1
          },
        },
      },
    ]);
    return result[0]
  }
  public async findSubscriptionsOfUserwithUserIdAndTrainerId(data: CheckSubscriptionStatusDTO): Promise<SubscriptionPlanEntity[] | null> {
    const { _id, trainerId } = data;
    const result = await userSubscriptionPlanModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(_id),
          trainerId: new mongoose.Types.ObjectId(trainerId)
        }
      }
    ]);
  
    return result.length > 0 ? result : null;
  }
  public async   findSubscriptionByStripeSubscriptionIdAndUpdateStatus(data: UpdateSubscriptionStatusDTO): Promise<SubscriptionPlanEntity | null> {
    const { status,stripeSubscriptionId} = data;
    const result = await userSubscriptionPlanModel.findOneAndUpdate({stripeSubscriptionId:stripeSubscriptionId},{stripeSubscriptionStatus:status})
    return result
  }

  public async findAllTrainerSubscribers(data: IdDTO): Promise<MonogoTrainerSubscribersList[]> {

    return await userSubscriptionPlanModel.aggregate([
      { $match: { trainerId: new mongoose.Types.ObjectId(data) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "subscribedUserData",
        },
      },
      { $unwind: "$subscribedUserData" },
      {
        $project: {
          _id: 1,
          durationInWeeks: 1,
          price: 1,
          sessionsPerWeek: 1,
          stripePriceId: 1,
          stripeSubscriptionStatus: 1,
          stripeSubscriptionId: 1,
          subPeriod: 1,
          totalSessions: 1,
          trainerId: 1,
          userId: 1,
          subscribedUserData: {
            _id: 1,
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked: 1,
          },
        },
      },
    ])
  }

  public async findAllActiveSubscribers(data: IdDTO): Promise<MonogoTrainerSubscribersList[]> {
    return await userSubscriptionPlanModel.aggregate([
      { $match: { trainerId: new mongoose.Types.ObjectId(data) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "subscribedUserData",
        },
      },
      { $match :{stripeSubscriptionStatus:"active"}},
      { $unwind: "$subscribedUserData" },
      {
        $project: {
          _id: 1,
          durationInWeeks: 1,
          price: 1,
          sessionsPerWeek: 1,
          stripePriceId: 1,
          stripeSubscriptionStatus: 1,
          stripeSubscriptionId: 1,
          subPeriod: 1,
          totalSessions: 1,
          trainerId: 1,
          userId: 1,
          subscribedUserData: {
            _id: 1,
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked: 1,
          },
        },
      },
    ])
  }

  public async findCanceledSubscribers(data: IdDTO): Promise<MonogoTrainerSubscribersList[]> {
    return await userSubscriptionPlanModel.aggregate([
      { $match: { trainerId: new mongoose.Types.ObjectId(data) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "subscribedUserData",
        },
      },
      { $match :{stripeSubscriptionStatus:"canceled"}},
      { $unwind: "$subscribedUserData" },
      {
        $project: {
          _id: 1,
          durationInWeeks: 1,
          price: 1,
          sessionsPerWeek: 1,
          stripePriceId: 1,
          stripeSubscriptionStatus: 1,
          stripeSubscriptionId: 1,
          subPeriod: 1,
          totalSessions: 1,
          trainerId: 1,
          userId: 1,
          subscribedUserData: {
            _id: 1,
            fname: 1,
            lname: 1,
            email: 1,
            profilePic: 1,
            isBlocked: 1,
          },
        },
      },
    ])
  }

  public async trainerChartDataFilter(trainerId: IdDTO, data: DateRangeQueryDTO): Promise<any> {

    const {startDate,endDate} = data
    console.log("trainerdid",trainerId)

    console.log("data",data)
    const result = await userSubscriptionPlanModel.aggregate([
      {
        $match: {
          trainerId: new mongoose.Types.ObjectId(trainerId),
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ["$stripeSubscriptionStatus", "active"] }, 1, 0]
            }
          },
          canceled: {
            $sum: {
              $cond: [{ $eq: ["$stripeSubscriptionStatus", "canceled"] }, 1, 0]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    return result
  }

     public async trainerPieChartDataFilter(trainerId:IdDTO,data:DateRangeQueryDTO):Promise<any>{

      const {startDate,endDate} = data
      console.log("trainerdid",trainerId)
  
      console.log("data",data)
      const result = await userSubscriptionPlanModel.aggregate([
        {
          $match: {
            trainerId: new mongoose.Types.ObjectId(trainerId),
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {$group:
           {
              _id:"$subPeriod",
              value:{$sum:1}
           }
        },
        
       
      
      ])
    
      console.log("result of the pie chart",result)
     return result
    }

    // findAllSubscriptionsOfUser(userId: IdDTO): Promise<any> {
      

    // }

}
