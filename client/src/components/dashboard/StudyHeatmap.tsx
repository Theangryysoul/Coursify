import { useMemo } from "react";
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

const CELL_SIZE = 14; // px, matches h-3.5 w-3.5
const CELL_GAP = 3; // px, normal spacing between week columns
const MONTH_GAP = 10; // px, extra spacing before the first week of a new month

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

  if (isPending) {
    return <div className="h-48 animate-pulse rounded-3xl bg-muted" />;
  }

  if (!data) return null;

  const getMarginLeft = (weekIndex: number) => {
    if (weekIndex === 0) return 0;
    return weekMeta[weekIndex]?.isMonthStart ? MONTH_GAP : CELL_GAP;
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Study Activity</h2>

        <span className="text-sm text-muted-foreground">Last 365 days</span>
      </div>

      <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
        <div className="min-w-max w-full">
          {/* Month labels */}
          <div className="mb-2 ml-[42px] flex h-4">
            {monthGroups.map((group) => (
              <div
                key={`month-${group.start}`}
                className="flex shrink-0 justify-center"
                style={{
                  width:
                    group.span * CELL_SIZE + (group.span - 1) * CELL_GAP,
                  marginLeft: getMarginLeft(group.start),
                }}
              >
                <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                  {group.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Weekday labels */}
            <div className="mr-2 flex w-[34px] flex-col justify-between text-[11px] text-muted-foreground">
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
                    gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
                    rowGap: `${CELL_GAP}px`,
                    width: CELL_SIZE,
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
                        className={`h-3.5 w-3.5 rounded-[3px] transition-all hover:scale-125 hover:ring-2 hover:ring-primary ${
                          COLORS[day.level]
                        }`}
                      />
                    ) : (
                      <div key={dayIndex} className="h-3.5 w-3.5" />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-5 flex items-center justify-end gap-2 text-xs text-muted-foreground">
            <span>Less</span>

            {COLORS.map((color) => (
              <div
                key={color}
                className={`h-3 w-3 rounded-sm ${color}`}
              />
            ))}

            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
