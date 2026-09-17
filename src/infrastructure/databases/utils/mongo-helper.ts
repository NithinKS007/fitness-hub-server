import { BaseQueryDTO } from "@application/dtos/query-dtos";
import { ApplyInFilter, DateFilter, Lookup, Search } from "./helper-types";

export class MongoHelper {
  subStatus() {
    return new Map<string, string>([
      ["Active", "active"],
      ["Canceled", "canceled"],
      ["Incomplete", "incomplete"],
      ["Incomplete expired", "incomplete_expired"],
      ["Trialing", "trialing"],
      ["Past due", "past_due"],
      ["Unpaid", "unpaid"],
      ["Paused", "paused"],
    ]);
  }

  subPeriod() {
    return new Map<string, string>([
      ["Monthly", "monthly"],
      ["Quarterly", "quarterly"],
      ["Yearly", "yearly"],
      ["HalfYearly", "halfYearly"],
    ]);
  }

  subFilter(filters?: string[]) {
    if (filters && filters.length > 0 && !filters.includes("All")) {
      const conditions: { [key: string]: string }[] = [];
      filters?.forEach((filter) => {
        const status = this.subStatus().get(filter);
        const period = this.subPeriod().get(filter);
        if (status && typeof status === "string") {
          conditions.push({
            stripeSubscriptionStatus: status,
          });
        }
        if (period && typeof period === "string") {
          conditions.push({
            subPeriod: period,
          });
        }
      });
      return conditions;
    }
  }

  userProj() {
    return {
      "userData._id": 1,
      "userData.fname": 1,
      "userData.lname": 1,
      "userData.email": 1,
      "userData.phone": 1,
      "userData.profilePic": 1,
      "userData.isBlocked": 1,
    };
  }

  trainerProj() {
    return {
      "trainerData._id": 1,
      "trainerData.fname": 1,
      "trainerData.lname": 1,
      "trainerData.email": 1,
      "trainerData.phone": 1,
      "trainerData.profilePic": 1,
      "trainerData.isBlocked": 1,
    };
  }
  dateFilter(dateData: Partial<BaseQueryDTO>, field: string): DateFilter {
    const { fromDate, toDate } = dateData;
    let matchQuery: DateFilter = {};
    if (fromDate && toDate) {
      matchQuery[field] = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
      matchQuery[field] = { $gte: fromDate };
    } else if (toDate) {
      matchQuery[field] = { $lte: toDate };
    }
    return matchQuery;
  }

  applyInFilter(filterData: Partial<BaseQueryDTO>, field: string): ApplyInFilter {
    const { filters } = filterData;
    let matchQuery: ApplyInFilter = {};
    if (filters && filters.length > 0) {
      matchQuery[field] = { $in: filters };
    }
    return matchQuery;
  }

  search(searchData: Partial<BaseQueryDTO>, fields: string[]): Search {
    const { search } = searchData;
    let matchQuery: Search = {};
    if (search && fields.length > 0) {
      matchQuery.$or = fields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    }
    return matchQuery;
  }

  lookup(data: {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
  }): Lookup {
    return [
      {
        $lookup: {
          from: data.from,
          localField: data.localField,
          foreignField: data.foreignField,
          as: data.as,
        },
      },
      {
        $unwind: {
          path: `$${data.as}`,
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  }
}
