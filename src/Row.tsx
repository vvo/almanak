import React from "react";
import Day from "./Day";
import {
  unstable_GridRow as GridRow,
  unstable_GridStateReturn as GridStateReturn,
} from "reakit/Grid";
import { CalendarState } from "./useCalendarState";
import { DateTime } from "luxon";
import classNames from "classnames";

export default function Row({
  days,
  isFirstRow,
  grid,
  todayRef,
  ...calendar
}: CalendarState & {
  days: DateTime[];
  grid: GridStateReturn;
  isFirstRow: boolean;
  todayRef?: React.RefObject<HTMLDivElement>;
}): JSX.Element {
  return (
    <GridRow
      {...grid}
      className={classNames(
        "grid grid-cols-2 lg:grid-cols-7 h-full divide-x",
        isFirstRow && "border-t border-transparent"
      )}
    >
      {days.map((day, dayIndex) => {
        return (
          <Day
            isFirstRow={isFirstRow}
            day={day}
            key={dayIndex}
            grid={grid}
            todayRef={todayRef}
            {...calendar}
          />
        );
      })}
    </GridRow>
  );
}
