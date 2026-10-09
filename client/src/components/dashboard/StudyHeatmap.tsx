import { useEffect, useMemo, useRef, useState } from "react";
import { useHeatmap } from "@/hooks/progress/useHeatmap";

const COLORS = [
  "bg-muted",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-400 dark:bg-emerald-700",
  "bg-emerald-600 dark:bg-emerald-500",
  "bg-emerald-800 dark:bg-emerald-300",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type HeatmapDay = {
  date: string;
  watchedSeconds: number;
  level: number;
};

type WeekMeta = {
  isMonthStart: boolean;
  label: string | null;
};

/*
 * Sizing is derived from the space the card actually has rather than fixed at
 * 14px cells. A year of data is around 64 columns once the month breaks are
 * counted, which at the designed size needs roughly 1250px - more than the
 * content area of a laptop, so the chart never fitted at 100% and had to be
 * scrolled sideways to be read. The chart keeps its designed size when there is
 * room and shrinks to fit when there is not.
 *
 * Measurements are taken in CSS pixels, which is also what the design used: it
 * was laid out at 80% browser zoom, where a 14px cell was 11 device pixels.
 */
const MAX_CELL_SIZE = 14; // px, the size the chart was designed around
const MIN_CELL_SIZE = 6; // px, below this the cells stop being readable
const WEEKDAY_LABEL_WIDTH = 42; // px, the 34px label column plus its 8px gap

// Ratios against the designed 14px cell, so gaps and label text shrink with it.
const CELL_GAP_RATIO = 3 / 14;
const MONTH_GAP_RATIO = 10 / 14;

const layoutFor = (available: number, columns: number, monthStarts: number) => {
  // width = columns * cell + gap * plainGaps + monthGap * monthStarts, with
  // both gaps expressed as a fraction of the cell, which collapses to the
  // single division below.
  const plainGaps = Math.max(0, columns - 1 - monthStarts);

  const divisor =
    columns + (CELL_GAP_RATIO * plainGaps + MONTH_GAP_RATIO * monthStarts);

  // `available` is 0 until the first measurement lands; render at the designed
  // size for that frame rather than collapsing to the floor and back.
  const cell =
    available > 0 && divisor > 0
      ? Math.min(
          MAX_CELL_SIZE,
          Math.max(MIN_CELL_SIZE, Math.floor(available / divisor))
        )
      : MAX_CELL_SIZE;

  return {
    cell,
    gap: Math.max(2, Math.round(cell * CELL_GAP_RATIO)),
    monthGap: Math.max(5, Math.round(cell * MONTH_GAP_RATIO)),
    labelFont: Math.max(8, Math.round(cell * 0.78)),
  };
};

export function StudyHeatmap() {
  const { data, isPending } = useHeatmap();

  const { weeks, weekMeta } = useMemo(() => {
    if (!data?.length)
      return {
        weeks: [] as (HeatmapDay | null)[][],
        weekMeta: [] as WeekMeta[],
      };

    const weeks: (HeatmapDay | null)[][] = [];

    // Monday = 0 ... Sunday = 6
    const weekdayOf = (dateStr: string) => {
      const d = new Date(dateStr);
      return (d.getDay() + 6) % 7;
    };
    const monthKeyOf = (dateStr: string) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${d.getMonth()}`;
    };

    let currentWeek: (HeatmapDay | null)[] = new Array(7).fill(null);
    let currentMonthKey: string | null = null;
    let columnHasData = false;

    for (const day of data) {
      const weekday = weekdayOf(day.date);
      const monthKey = monthKeyOf(day.date);

      // Force a new column whenever the month changes, so a single
      // week column never contains days from two different months.
      if (columnHasData && monthKey !== currentMonthKey) {
        weeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
        columnHasData = false;
      }

      currentMonthKey = monthKey;
      currentWeek[weekday] = day;
      columnHasData = true;

      // A finished Mon-Sun column also starts a fresh one.
      if (weekday === 6) {
        weeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
        columnHasData = false;
      }
    }

    if (columnHasData) {
      weeks.push(currentWeek);
    }

    // Build per-column metadata: the first column of every month gets a
    // label, and every month after the first gets an extra visual gap.
    const weekMeta: WeekMeta[] = weeks.map((week, weekIndex) => {
      const firstDay = week.find((d): d is HeatmapDay => d !== null);
      if (!firstDay) return { isMonthStart: false, label: null };

      const month = new Date(firstDay.date).getMonth();

      const prevWeek = weekIndex > 0 ? weeks[weekIndex - 1] : null;
      const prevFirstDay = prevWeek
        ? prevWeek.find((d): d is HeatmapDay => d !== null)
        : null;
      const prevMonth = prevFirstDay
        ? new Date(prevFirstDay.date).getMonth()
        : null;

      if (weekIndex === 0) {
        return { isMonthStart: false, label: MONTHS[month] };
      }

      if (month !== prevMonth) {
        return { isMonthStart: true, label: MONTHS[month] };
      }

      return { isMonthStart: false, label: null };
    });

    return { weeks, weekMeta };
  }, [data]);

  // Width of the area the chart may occupy. Measured on the card's content
  // box, which is `w-full`, so it is the space available and not the width of
  // the (potentially wider) chart itself.
  const chartRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);

  useEffect(() => {
    const element = chartRef.current;

    if (!element) return;

    const measure = () =>
      setAvailableWidth(element.clientWidth - WEEKDAY_LABEL_WIDTH);

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [weeks.length]);

  const monthStarts = weekMeta.filter((meta) => meta.isMonthStart).length;

  const layout = useMemo(
    () => layoutFor(availableWidth, weeks.length, monthStarts),
    [availableWidth, weeks.length, monthStarts]
  );

  if (isPending) {
    return <div className="h-48 animate-pulse rounded-3xl bg-muted" />;
  }

  if (!data) return null;

  const { cell, gap, monthGap, labelFont } = layout;

  const getMarginLeft = (weekIndex: number) => {
    if (weekIndex === 0) return 0;
    return weekMeta[weekIndex]?.isMonthStart ? monthGap : gap;
  };

  const monthGroups = weeks.reduce<
    { start: number; span: number; label: string }[]
  >((acc, _, weekIndex) => {
    const label = weekMeta[weekIndex]?.label;
    if (label) {
      acc.push({ start: weekIndex, span: 1, label });
    } else if (acc.length) {
      acc[acc.length - 1].span += 1;
    }
    return acc;
  }, []);

  return (
    <section className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">Study Activity</h2>

        <span className="text-sm text-muted-foreground">Last 365 days</span>
      </div>

      <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
        <div ref={chartRef} className="w-full">
          {/* Month labels */}
          <div
            className="flex"
            style={{
              marginLeft: WEEKDAY_LABEL_WIDTH,
              marginBottom: gap + 2,
              height: labelFont + 5,
            }}
          >
            {monthGroups.map((group) => (
              <div
                key={`month-${group.start}`}
                className="flex shrink-0 justify-center"
                style={{
                  width: group.span * cell + (group.span - 1) * gap,
                  marginLeft: getMarginLeft(group.start),
                }}
              >
                <span
                  className="text-muted-foreground whitespace-nowrap"
                  style={{ fontSize: labelFont }}
                >
                  {group.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Weekday labels */}
            <div
              className="mr-2 flex w-[34px] flex-col justify-between text-muted-foreground"
              style={{ fontSize: labelFont }}
            >
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
              <span>Sun</span>
            </div>

            {/* Heatmap */}
            <div className="flex">
              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="grid shrink-0"
                  style={{
                    gridTemplateRows: `repeat(7, ${cell}px)`,
                    rowGap: `${gap}px`,
                    width: cell,
                    marginLeft: getMarginLeft(weekIndex),
                  }}
                >
                  {week.map((day, dayIndex) =>
                    day ? (
                      <div
                        key={day.date}
                        title={`${new Date(
                          day.date
                        ).toDateString()}
${Math.floor(day.watchedSeconds / 60)} min studied`}
                        className={`rounded-[3px] transition-all hover:scale-125 hover:ring-2 hover:ring-primary ${
                          COLORS[day.level]
                        }`}
                        style={{ width: cell, height: cell }}
                      />
                    ) : (
                      <div
                        key={dayIndex}
                        style={{ width: cell, height: cell }}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div
            className="mt-5 flex items-center justify-end gap-2 text-muted-foreground"
            style={{ fontSize: labelFont }}
          >
            <span>Less</span>

            {COLORS.map((color) => (
              <div
                key={color}
                className={`rounded-sm ${color}`}
                style={{
                  width: Math.max(8, cell - 2),
                  height: Math.max(8, cell - 2),
                }}
              />
            ))}

            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
