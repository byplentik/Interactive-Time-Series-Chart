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
    data: points([4, 22, 44.36, 56, 68, 80, 90]),
  },
  {
    type: "spline",
    name: "CPA",
    data: points([92, 64, 46.23, 51.5, 34, 21.4, 66.8]),
  },
  {
    type: "line",
    name: "ROI confirmed",
    data: points([5, 26, 41.47, 49, 62, 78, 93.2]),
  },
  {
    type: "bar",
    name: "Conversions",
    data: points([2, 3, 3, 2, 3, 2, 3]),
  },
];
