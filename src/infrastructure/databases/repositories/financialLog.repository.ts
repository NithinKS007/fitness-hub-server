import { Model } from "mongoose";
import { Transactions } from "@application/dtos/financialLog-dtos";
import { IFinancialLogRepository } from "@domain/interfaces/IFinancialLogRepository";
import { DateRangeDTO, GetTransactions } from "@application/dtos/query-dtos";
import { PagedResponse } from "@application/dtos/utility-dtos";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { paginateReq, paginateRes } from "@shared/utils/handle-pagination";
import { financialLog } from "@domain/entities/financialLog.entity";
import FinancialLog, { IFinancialLog } from "../models/financialLog.model";
import {
  EarningsOverViewMapper,
  EarningsOverViewUI,
} from "@infrastructure/mappers/chart.mappers";
import { MongoHelper } from "../utils/mongo-helper";

export class FinancialLogRepository
  extends BaseRepository<IFinancialLog, financialLog>
  implements IFinancialLogRepository
{
  constructor(
    model: Model<IFinancialLog> = FinancialLog,
    private earningsOverViewMapper = new EarningsOverViewMapper(),
    private utility: MongoHelper = new MongoHelper()
  ) {
    super(model);
  }

  async getTotalServiceFee(): Promise<number> {
    const totalPlatFormFee = await this.model.aggregate([
      { $group: { _id: null, siteProfit: { $sum: "$serviceFee" } } },
    ]);
    return totalPlatFormFee[0]?.siteProfit || 0;
  }

  async getTotalCommission(): Promise<number> {
    const totalcommission = await this.model.aggregate([
      { $group: { _id: null, totalCommission: { $sum: "$commission" } } },
    ]);
    return totalcommission[0]?.totalCommission || 0;
  }

  async getTotalProfit(): Promise<number> {
    const totalProfit = await this.model.aggregate([
      {
        $group: {
          _id: null,
          totalProfit: { $sum: { $add: ["$serviceFee", "$commission"] } },
        },
      },
    ]);
    return totalProfit[0]?.totalProfit || 0;
  }

  async getEarningsOverView({
    startDate,
    endDate,
  }: DateRangeDTO): Promise<EarningsOverViewUI[]> {
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
          _id: "$createdAt",
          serviceFee: { $sum: "$serviceFee" },
          commission: { $sum: "$commission" },
          totalProfit: { $sum: { $add: ["$serviceFee", "$commission"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return result.map((data) => this.earningsOverViewMapper.map(data));
  }

  async getTransactions(
    dtos: GetTransactions
  ): Promise<PagedResponse<Transactions>> {
    const { page, limit, fromDate, toDate, search, filters } = dtos;
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);

    let matchQuery: any = {
      ...this.utility.search({ search }, [
        "subscriptionProvidedBy.fname",
        "subscriptionProvidedBy.lname",
        "subscriptionProvidedBy.email",
        "subscriptionTakenBy.fname",
        "subscriptionTakenBy.lname",
        "subscriptionTakenBy.email",
      ]),
      ...this.utility.dateFilter({ fromDate, toDate }, "createdAt"),
    };

    const conditions = this.utility.subFilter(filters);
    if (conditions && conditions.length > 0) matchQuery.$or = conditions;

    const trainerLookup = this.utility.lookup({
      from: "users",
      localField: "trainerId",
      foreignField: "_id",
      as: "subscriptionProvidedBy",
    });

    const userLookup = this.utility.lookup({
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "subscriptionTakenBy",
    });

    const subPlanLookup = this.utility.lookup({
      from: "usersubscriptionplans",
      localField: "userSubscriptionPlanId",
      foreignField: "_id",
      as: "userSubscriptionPlanData",
    });

    const commonPipeline = [
      ...trainerLookup,
      ...userLookup,
      ...subPlanLookup,
      { $match: matchQuery },
    ];

    const [totalCount, transactions] = await Promise.all([
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
              serviceFee: 1,
              trainerProfit: 1,
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
              providerSubStatus:
                "$userSubscriptionPlanData.providerSubStatus",
              subPeriod: "$userSubscriptionPlanData.subPeriod",
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
      data: transactions,
      pagination: paginationData,
    };
  }
}
