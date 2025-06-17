import { Model } from "mongoose";
import { PlatformRevenue } from "@application/dtos/revenue-dtos";
import { IPlatformEarningsRepository } from "@domain/interfaces/IPlatformEarningsRepository";
import {
  DateRangeQueryDTO,
  GetRevenueQueryDTO,
} from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { AdminChartData } from "@application/dtos/chart-dtos";
import { IRevenue } from "@domain/entities/revenue.entity";
import RevenueModel from "../models/revenue.model";

export class RevenueRepository
  extends BaseRepository<IRevenue>
  implements IPlatformEarningsRepository
{
  constructor(model: Model<IRevenue> = RevenueModel) {
    super(model);
  }

  async getTotalPlatFormFee(): Promise<number> {
    const totalPlatFormFee = await this.model.aggregate([
      { $group: { _id: null, totalPlatFormFee: { $sum: "$platformRevenue" } } },
    ]);
    return totalPlatFormFee[0]?.totalPlatFormFee || 0;
  }

  async getTotalCommission(): Promise<number> {
    const totalcommission = await this.model.aggregate([
      { $group: { _id: null, totalCommission: { $sum: "$commission" } } },
    ]);
    return totalcommission[0]?.totalCommission || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const totalRevenue = await this.model.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $add: ["$platformRevenue", "$commission"] } },
        },
      },
    ]);
    return totalRevenue[0]?.totalRevenue || 0;
  }

  async getRevenueChartData({
    startDate,
    endDate,
  }: DateRangeQueryDTO): Promise<AdminChartData[]> {
    const result = await this.model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          platformRevenue: { $sum: "$platformRevenue" },
          commission: { $sum: "$commission" },
          totalRevenue: { $sum: { $add: ["$platformRevenue", "$commission"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return result;
  }

  async getPlatformEarnings({
    page,
    limit,
    fromDate,
    toDate,
    search,
    filters,
  }: GetRevenueQueryDTO): Promise<{
    revenueData: PlatformRevenue[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    let matchQuery: any = {};

    if (search) {
      matchQuery.$or = [
        { "subscriptionProvidedBy.fname": { $regex: search, $options: "i" } },
        { "subscriptionProvidedBy.lname": { $regex: search, $options: "i" } },
        { "subscriptionProvidedBy.email": { $regex: search, $options: "i" } },
        { "subscriptionTakenBy.fname": { $regex: search, $options: "i" } },
        { "subscriptionTakenBy.lname": { $regex: search, $options: "i" } },
        { "subscriptionTakenBy.email": { $regex: search, $options: "i" } },
      ];
    }

    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions: any = [];
      if (filters.includes("Active"))
        conditions.push({
          "userSubscriptionPlanData.stripeSubscriptionStatus": "active",
        });
      if (filters.includes("Canceled"))
        conditions.push({
          "userSubscriptionPlanData.stripeSubscriptionStatus": "canceled",
        });
      if (filters.includes("Incomplete"))
        conditions.push({
          "userSubscriptionPlanData.stripeSubscriptionStatus": "incomplete",
        });
      if (filters.includes("Incomplete expired"))
        conditions.push({
          "userSubscriptionPlanData.stripeSubscriptionStatus":
            "incomplete_expired",
        });
      if (filters.includes("Trialing"))
        conditions.push({
          "userSubscriptionPlanData.stripeSubscriptionStatus": "trialing",
        });
      if (filters.includes("Past due"))
        conditions.push({
          "userSubscriptionPlanData.stripeSubscriptionStatus": "past_due",
        });
      if (filters.includes("Unpaid"))
        conditions.push({
          "userSubscriptionPlanData.stripeSubscriptionStatus": "unpaid",
        });
      if (filters.includes("Paused"))
        conditions.push({
          "userSubscriptionPlanData.stripeSubscriptionStatus": "paused",
        });
      if (filters.includes("Monthly"))
        conditions.push({ "userSubscriptionPlanData.subPeriod": "monthly" });
      if (filters.includes("Quarterly"))
        conditions.push({ "userSubscriptionPlanData.subPeriod": "quarterly" });
      if (filters.includes("Yearly"))
        conditions.push({ "userSubscriptionPlanData.subPeriod": "yearly" });
      if (filters.includes("HalfYearly"))
        conditions.push({ "userSubscriptionPlanData.subPeriod": "halfYearly" });
      if (conditions.length > 0) matchQuery.$or = conditions;
    }

    if (fromDate && toDate) {
      matchQuery.createdAt = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
      matchQuery.createdAt = { $gte: fromDate };
    } else if (toDate) {
      matchQuery.createdAt = { $lte: toDate };
    }

    const commonPipeline = [
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
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "subscriptionTakenBy",
        },
      },
      { $unwind: "$subscriptionTakenBy" },
      {
        $lookup: {
          from: "usersubscriptionplans",
          localField: "userSubscriptionPlanId",
          foreignField: "_id",
          as: "userSubscriptionPlanData",
        },
      },
      { $unwind: "$userSubscriptionPlanData" },
      { $match: matchQuery },
    ];

    const [totalCount, revenueData] = await Promise.all([
      this.model
        .aggregate([...commonPipeline, { $count: "totalCount" }])
        .then((result) => (result.length > 0 ? result[0].totalCount : 0)),
      this.model
        .aggregate([
          ...commonPipeline,
          {
            $project: {
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
                stripeSubscriptionStatus:
                  "$userSubscriptionPlanData.stripeSubscriptionStatus",
                subPeriod: "$userSubscriptionPlanData.subPeriod",
              },
            },
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .exec(),
    ]);

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });

    return {
      revenueData: revenueData,
      paginationData,
    };
  }
}
