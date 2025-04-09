export interface TrainerPieChartData {
  _id: string;
  value: number;
}

export interface TrainerChartData {
  _id: string;
  total: number;
  active: number;
  canceled: number;
}

export interface AdminChartData {
  _id: string;
  platformRevenue: number;
  commission: number;
  totalRevenue: number;
}
