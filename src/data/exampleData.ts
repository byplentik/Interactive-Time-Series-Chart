import type { ChartPoint, ChartSeries } from "../components/TimeSeriesChart/types";

const timestamps = [
  "2026-06-10T00:00:00Z",
  "2026-06-11T00:00:00Z",
  "2026-06-12T00:00:00Z",
  "2026-06-13T00:00:00Z",
  "2026-06-14T00:00:00Z",
  "2026-06-15T00:00:00Z",
  "2026-06-16T00:00:00Z",
] as const;

function points(values: readonly number[]): ChartPoint[] {
  return timestamps.map((timestamp, index) => ({
    timestamp,
    value: values[index] ?? 0,
  }));
}

export const exampleSeries: ChartSeries[] = [
  {
    type: "area",
    name: "Cost",
    data: points([6, 22, 44.36, 55.65, 71, 84, 96]),
  },
  {
    type: "bar",
    name: "CPA",
    data: points([1.05, 0.94, 1.23, 0.79, 1.08, 0.91, 0.86]),
  },
  {
    type: "spline",
    name: "ROI confirmed",
    data: points([340, 158, 161.47, 56.33, 42, 96, 172]),
  },
  {
    type: "line",
    name: "Conversions",
    data: points([4, 22, 36, 70, 79, 88, 97]),
  },
];
