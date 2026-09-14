# Interactive Time Series Chart

Reusable React component that renders four time series on a single Highcharts plot: **area**, **spline**, **line**, and **column** (vertical bars). The visual style, tooltip, and hover behaviour follow the provided interactive reference.

## Stack

- React
- TypeScript
- Vite
- Highcharts
- Highcharts React
- CSS

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`). The demo page shows the chart with example series from `src/data/exampleData.ts`.

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

The chart is a standalone component. It is not tied to the example dataset and receives all series through props:

```tsx
import { TimeSeriesChart } from "./components/TimeSeriesChart/TimeSeriesChart";
import type { ChartSeries } from "./components/TimeSeriesChart/types";

const series: ChartSeries[] = [
  {
    type: "area",
    name: "Cost",
    data: [...],
  },
  {
    type: "spline",
    name: "CPA",
    data: [...],
  },
  {
    type: "line",
    name: "ROI confirmed",
    data: [...],
  },
  {
    type: "bar",
    name: "Conversions",
    data: [...],
  },
];

<TimeSeriesChart series={series} />
```

`type: "bar"` is rendered as Highcharts `column` (vertical bars) so all four series share the same datetime x-axis.

To pass your own data, replace `exampleSeries` in `src/App.tsx` or import `TimeSeriesChart` into another React tree and provide a `series` array.

## Data format

Each point uses an ISO 8601 timestamp (or any string that `Date` can parse) and a numeric value:

```ts
type ChartPoint = {
  timestamp: string;
  value: number;
};
```

Example timestamp: `2026-06-12T00:00:00Z`.

Each series has a chart type, a display name, and a list of points:

```ts
type ChartSeries = {
  type: "area" | "spline" | "line" | "bar";
  name: string;
  data: ChartPoint[];
};
```

The component converts timestamps to Highcharts datetime values (milliseconds). Shared tooltips work best when series use the same timestamps.

Series colors are fixed by type:

| Type   | Color   | Approx. hex |
| ------ | ------- | ----------- |
| area   | yellow  | `#FFE66D`   |
| spline | green   | `#228B22`   |
| line   | purple  | `#A000FF`   |
| bar    | blue    | `#3267E8`   |
