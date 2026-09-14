export type ChartPoint = {
  timestamp: string;
  value: number;
};

export type ChartSeriesType = "area" | "spline" | "line" | "bar";

export type ChartSeries = {
  type: ChartSeriesType;
  name: string;
  data: ChartPoint[];
};

export type TimeSeriesChartProps = {
  series: ChartSeries[];
};
