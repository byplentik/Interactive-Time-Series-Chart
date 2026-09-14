import { useLayoutEffect, useMemo, useRef } from "react";
import Highcharts from "highcharts";
import type { ColorType, Options, Point, SeriesOptionsType } from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import type { HighchartsReactRefObject } from "highcharts-react-official";
import type { ChartSeries, ChartSeriesType, TimeSeriesChartProps } from "./types";
import "./TimeSeriesChart.css";

export type { ChartPoint, ChartSeries, ChartSeriesType, TimeSeriesChartProps } from "./types";

const SERIES_COLORS: Record<ChartSeriesType, string> = {
  area: "#FFE66D",
  spline: "#228B22",
  line: "#A000FF",
  bar: "#3267E8",
};

const SERIES_Z_INDEX: Record<ChartSeriesType, number> = {
  area: 1,
  bar: 2,
  spline: 3,
  line: 4,
};

const DAY_MS = 24 * 3600 * 1000;

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

function toHighchartsSeries(series: ChartSeries): SeriesOptionsType {
  const color = SERIES_COLORS[series.type];
  const data = toHighchartsData(series);
  const zIndex = SERIES_Z_INDEX[series.type];

  if (series.type === "area") {
    return {
      type: "area",
      name: series.name,
      data,
      color,
      zIndex,
      lineWidth: 1.6,
      lineColor: "#F0D24F",
      fillOpacity: 0.48,
      threshold: 0,
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
      states: {
        hover: {
          lineWidthPlus: 0,
          halo: {
            size: 0,
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
      zIndex,
      lineWidth: 2.4,
      marker: {
        enabled: false,
        symbol: "circle",
        radius: 4,
        fillColor: "#ffffff",
        lineColor: color,
        lineWidth: 2,
        states: {
          hover: {
            enabled: true,
            radius: 5,
            lineWidth: 2,
            fillColor: "#ffffff",
            lineColor: color,
          },
        },
      },
      states: {
        hover: {
          lineWidthPlus: 0.4,
          halo: {
            size: 14,
            opacity: 0.22,
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
      zIndex,
      lineWidth: 2,
      marker: {
        enabled: true,
        symbol: "square",
        radius: 5.5,
        fillColor: color,
        lineWidth: 0,
        states: {
          hover: {
            enabled: true,
            radius: 6.5,
            lineWidth: 2,
            lineColor: "#ffffff",
            fillColor: color,
          },
        },
      },
      states: {
        hover: {
          lineWidthPlus: 0.6,
          halo: {
            size: 0,
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
    zIndex,
    borderWidth: 0,
    borderRadius: 0,
    pointWidth: 10,
    grouping: false,
    pointPlacement: "on",
    states: {
      hover: {
        brightness: 0.08,
        halo: {
          size: 0,
        },
      },
    },
  };
}

function buildChartOptions(series: ChartSeries[]): Options {
  return {
    chart: {
      backgroundColor: "transparent",
      plotBackgroundColor: "#fbfbf8",
      plotBorderColor: "#c4c4c4",
      plotBorderWidth: 1,
      plotShadow: false,
      height: 460,
      spacing: [20, 20, 32, 16],
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
      tickInterval: DAY_MS,
      minPadding: 0.06,
      maxPadding: 0.06,
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 1,
      gridLineColor: "#e6e6e6",
      labels: {
        format: "{value:%d.%m}",
        style: {
          color: "#8d8d8d",
          fontSize: "11px",
        },
        y: 18,
      },
      dateTimeLabelFormats: {
        day: "%d.%m",
        week: "%d.%m",
        month: "%d.%m",
      },
    },
    yAxis: {
      title: {
        text: undefined,
      },
      min: 0,
      maxPadding: 0.08,
      endOnTick: false,
      gridLineWidth: 1,
      gridLineColor: "#e6e6e6",
      lineWidth: 0,
      tickWidth: 0,
      labels: {
        enabled: false,
      },
    },
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
        minPointLength: 2,
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
              height: 380,
              spacing: [10, 8, 22, 8],
            },
            xAxis: {
              tickInterval: undefined,
              labels: {
                style: {
                  fontSize: "10px",
                },
              },
            },
          },
        },
        {
          condition: {
            maxWidth: 480,
          },
          chartOptions: {
            chart: {
              height: 340,
              spacing: [8, 4, 18, 4],
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
