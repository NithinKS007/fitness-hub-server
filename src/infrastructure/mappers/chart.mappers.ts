import { BaseMapper } from "../../infrastructure/mappers/BaseMapper";

interface BaseTRPeriodWiseCount {
  name: string;
  value: number;
}

export type TRSubPeriodWiseCountDB = BaseTRPeriodWiseCount & {
  _id: string;
};

export type TRSubPeriodWiseCountUI = BaseTRPeriodWiseCount & {
  id: string;
};

export interface BaseTRSubStatusWiseCount {
  total: number;
  active: number;
  canceled: number;
}

export type TRSubStatusWiseCountDB = BaseTRSubStatusWiseCount & {
  _id: Date;
};

export type TRSubStatusWiseCountUI = BaseTRSubStatusWiseCount & {
  id: string;
};

export interface BaseEarningsOverView {
  serviceFee: number;
  commission: number;
  totalProfit: number;
}

export type EarningsOverViewDB = BaseEarningsOverView & { _id: Date };
export type EarningsOverViewUI = BaseEarningsOverView & { id: string };

export class TRSubPeriodWiseCountMapper extends BaseMapper<
  TRSubPeriodWiseCountDB,
  TRSubPeriodWiseCountUI
> {
  mapToDomain(data: TRSubPeriodWiseCountDB): TRSubPeriodWiseCountUI {
    return {
      id: data._id,
      name: data._id,
      value: data.value,
    };
  }

  map(data: TRSubPeriodWiseCountDB): TRSubPeriodWiseCountUI {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

export class TRSubStatusWiseCountMapper extends BaseMapper<
  TRSubStatusWiseCountDB,
  TRSubStatusWiseCountUI
> {
  mapToDomain(data: TRSubStatusWiseCountDB): TRSubStatusWiseCountUI {
    return {
      id: this.mapToISODateString(data._id),
      total: data.total,
      active: data.active,
      canceled: data.canceled,
    };
  }

  map(data: TRSubStatusWiseCountDB): TRSubStatusWiseCountUI {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}

export class EarningsOverViewMapper extends BaseMapper<
  EarningsOverViewDB,
  EarningsOverViewUI
> {
  mapToDomain(data: EarningsOverViewDB): EarningsOverViewUI {
    return {
      id: this.mapToISODateString(data._id),
      serviceFee: data.serviceFee,
      commission: data.commission,
      totalProfit: data.totalProfit,
    };
  }

  map(data: EarningsOverViewDB): EarningsOverViewUI {
    return this.toDomain(data, this.mapToDomain.bind(this));
  }
}
