import React from "react";
import Day from "./Day";
import dayjs from "dayjs";
import { unstable_GridRow as GridRow } from "reakit/Grid";
import { useGridContext } from "./GridProvider";
import { CalendarState } from "./useCalendarState";

export default function Week({
  days,
  isFirstWeek,
  ...calendar
}: CalendarState & { days: dayjs.Dayjs[]; isFirstWeek: boolean }): JSX.Element {
  const grid = useGridContext();
  return (
    <GridRow {...grid} className="grid grid-cols-7 h-full">
      {days.map((day, dayIndex) => {
        return (
          <Day
            isFirstWeek={isFirstWeek}
            day={day}
            key={dayIndex}
            {...calendar}
          />
        );
      })}
    </GridRow>
  );
}
