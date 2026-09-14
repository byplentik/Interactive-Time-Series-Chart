import { useLayoutEffect, useMemo, useRef } from "react";
import Highcharts from "highcharts";
import type { ColorType, Options, Point, SeriesOptionsType, YAxisOptions } from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import type { HighchartsReactRefObject } from "highcharts-react-official";
import type { ChartSeries, ChartSeriesType, TimeSeriesChartProps } from "./types";
import "./TimeSeriesChart.css";

export type { ChartPoint, ChartSeries, ChartSeriesType, TimeSeriesChartProps } from "./types";

const SERIES_COLORS: Record<ChartSeriesType, string> = {
  area: "#F4E394",
  spline: "#2AA12A",
  line: "#D000FF",
  bar: "#3B6FE8",
};

const SERIES_Z_INDEX: Record<ChartSeriesType, number> = {
  area: 1,
  bar: 2,
  spline: 3,
  line: 4,
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatChartValue(value: number): string {
  return String(Math.round(value * 100) / 100);
}

function toCssColor(color: ColorType | undefined, fallback: string): string {
  return typeof color === "string" ? color : fallback;
}

function toHighchartsData(series: ChartSeries): Array<[number, number]> {
  return series.data.map((point) => [
    new Date(point.timestamp).getTime(),
    point.value,
  ]);
}

function getAxisMax(series: ChartSeries): number {
  const maxValue = Math.max(0, ...series.data.map((point) => point.value));

  if (series.type === "bar") {
    return Math.max(maxValue * 40, 12);
  }

  return maxValue === 0 ? 1 : maxValue * 1.08;
}

function toHighchartsSeries(series: ChartSeries, axisIndex: number): SeriesOptionsType {
  const color = SERIES_COLORS[series.type];
  const data = toHighchartsData(series);
  const zIndex = SERIES_Z_INDEX[series.type];

  if (series.type === "area") {
    return {
      type: "area",
      name: series.name,
      data,
      color,
      yAxis: axisIndex,
      zIndex,
      lineWidth: 1.2,
      lineColor: "#E8D36A",
      fillOpacity: 0.72,
      threshold: 0,
      marker: {
        enabled: false,
        symbol: "circle",
        radius: 3.5,
        fillColor: "#F6E7A0",
        lineWidth: 0,
        states: {
          hover: {
            enabled: true,
            radius: 4.5,
          },
        },
      },
      states: {
        hover: {
          lineWidthPlus: 0,
          halo: {
            size: 8,
            opacity: 0.18,
          },
        },
      },
    };
  }

  if (series.type === "spline") {
    return {
      type: "spline",
      name: series.name,
      data,
      color,
      yAxis: axisIndex,
      zIndex,
      lineWidth: 6,
      marker: {
        enabled: false,
        symbol: "circle",
        radius: 4.5,
        fillColor: "#ffffff",
        lineColor: color,
        lineWidth: 2,
        states: {
          hover: {
            enabled: true,
            radius: 5.5,
            lineWidth: 2,
            fillColor: "#ffffff",
            lineColor: color,
          },
        },
      },
      states: {
        hover: {
          lineWidthPlus: 0,
          halo: {
            size: 18,
            opacity: 0.28,
          },
        },
      },
    };
  }

  if (series.type === "line") {
    return {
      type: "line",
      name: series.name,
      data,
      color,
      yAxis: axisIndex,
      zIndex,
      lineWidth: 2.2,
      marker: {
        enabled: true,
        symbol: "square",
        radius: 5.5,
        fillColor: color,
        lineWidth: 0,
        states: {
          hover: {
            enabled: true,
            radius: 6,
            lineWidth: 0,
            fillColor: color,
          },
        },
      },
      states: {
        hover: {
          lineWidthPlus: 0.4,
          halo: {
            size: 16,
            opacity: 0.28,
          },
        },
      },
    };
  }

  return {
    type: "column",
    name: series.name,
    data,
    color,
    yAxis: axisIndex,
    zIndex,
    borderWidth: 0,
    borderRadius: 0,
    pointWidth: 16,
    grouping: false,
    pointPlacement: "on",
    states: {
      hover: {
        brightness: 0.06,
        halo: {
          size: 0,
        },
      },
    },
  };
}

function buildYAxes(series: ChartSeries[]): YAxisOptions[] {
  if (series.length === 0) {
    return [
      {
        title: { text: undefined },
        labels: { enabled: false },
        gridLineWidth: 0,
        lineWidth: 0,
      },
    ];
  }

  return series.map((item, index) => ({
    title: {
      text: undefined,
    },
    min: 0,
    max: getAxisMax(item),
    startOnTick: false,
    endOnTick: false,
    gridLineWidth: 0,
    lineWidth: 0,
    tickWidth: 0,
    tickLength: 0,
    labels: {
      enabled: false,
    },
    visible: index === 0,
  }));
}

function buildChartOptions(series: ChartSeries[]): Options {
  return {
    chart: {
      backgroundColor: "transparent",
      plotBackgroundColor: "#f6d3d7",
      plotBorderColor: "#c1c1c1",
      plotBorderWidth: 1,
      plotShadow: false,
      height: 420,
      spacing: [10, 10, 10, 8],
      style: {
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        cursor: "pointer",
      },
      animation: false,
    },
    time: {
      timezone: "UTC",
    },
    title: {
      text: undefined,
    },
    subtitle: {
      text: undefined,
    },
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    colors: Object.values(SERIES_COLORS),
    xAxis: {
      type: "datetime",
      minPadding: 0.02,
      maxPadding: 0.02,
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      labels: {
        enabled: false,
      },
    },
    yAxis: buildYAxes(series),
    tooltip: {
      shared: true,
      useHTML: true,
      outside: true,
      followPointer: false,
      hideDelay: 50,
      padding: 0,
      borderWidth: 0,
      borderRadius: 12,
      backgroundColor: "transparent",
      shadow: false,
      style: {
        fontSize: "13px",
      },
      formatter: function (this: Point) {
        const hoveredPoints = this.points ?? [this];
        const date = Highcharts.dateFormat("%d.%m.%Y", this.x);
        const rows = hoveredPoints
          .map((point) => {
            const color = toCssColor(point.series.color, "#888888");
            const name = escapeHtml(point.series.name);
            const value = formatChartValue(point.y ?? 0);

            return `<div class="ts-chart-tooltip__row"><span class="ts-chart-tooltip__marker" style="background-color:${color}"></span><span class="ts-chart-tooltip__name">${name}:</span><span class="ts-chart-tooltip__value">${value}</span></div>`;
          })
          .join("");

        return `<div class="ts-chart-tooltip"><div class="ts-chart-tooltip__date">${date}</div>${rows}</div>`;
      },
    },
    plotOptions: {
      series: {
        animation: false,
        cursor: "pointer",
        stickyTracking: true,
        findNearestPointBy: "x",
        states: {
          inactive: {
            opacity: 1,
          },
        },
      },
      area: {
        trackByArea: false,
        crisp: true,
      },
      column: {
        crisp: true,
      },
    },
    series: series.map(toHighchartsSeries),
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 768,
          },
          chartOptions: {
            chart: {
              height: 340,
              spacing: [8, 6, 8, 6],
            },
          },
        },
        {
          condition: {
            maxWidth: 480,
          },
          chartOptions: {
            chart: {
              height: 280,
              spacing: [6, 4, 6, 4],
            },
          },
        },
      ],
    },
  };
}

export function TimeSeriesChart({ series }: TimeSeriesChartProps) {
  const options = useMemo(() => buildChartOptions(series), [series]);
  const chartRef = useRef<HighchartsReactRefObject>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const chart = chartRef.current?.chart;

    if (!wrapper || !chart) {
      return;
    }

    const observer = new ResizeObserver(() => {
      chart.reflow();
    });

    observer.observe(wrapper);
    chart.reflow();

    return () => observer.disconnect();
  }, [options]);

  return (
    <div ref={wrapperRef} className="time-series-chart">
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={options}
        containerProps={{ className: "time-series-chart__container" }}
      />
    </div>
  );
}
