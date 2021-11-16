import React from "react";

import {
  unstable_GridCell as GridCell,
  unstable_GridStateReturn as GridStateReturn,
} from "reakit/Grid";
import { DateTime } from "luxon";

import classNames from "classnames";
import { CalendarState } from "./useCalendarState";

export default function Day({
  day,
  grid,
  isFirstRow,
  todayRef,
  ...calendar
}: CalendarState & {
  grid: GridStateReturn;
  day: DateTime;
  isFirstRow: boolean;
  todayRef?: React.RefObject<HTMLDivElement>;
}) {
  const isFirstDay = day.day === 1;
  const isToday = day.hasSame(DateTime.local(), "day");
  const isDifferentMonth = !day.hasSame(calendar.currentDay, "month");
  const isPast = day < DateTime.local().startOf("day");

  return (
    <GridCell {...grid} as="div" className="h-full">
      <div
        className={classNames(
          "flex justify-center items-center mb-1 h-7 text-xs font-medium text-center",
          !isFirstRow && "mt-0.5"
        )}
        ref={isToday ? todayRef : null}
      >
        <div
          className={classNames(
            "flex items-center justify-center mx-auto",
            isDifferentMonth && "text-gray-500"
          )}
        >
          {isFirstDay && (
            <div className="hidden lg:block mr-1">{day.toFormat("MMM")}</div>
          )}
          <div className="lg:hidden mr-1">{day.toFormat("ccc")}</div>
          <div
            className={classNames(
              isToday &&
                "bg-blue-600 text-white w-6 h-6 flex rounded-full items-center justify-center"
            )}
          >
            {day.day}
          </div>
        </div>
      </div>
      <div className={classNames(isPast && "opacity-50")}>
        {calendar.renderDay(day)}
      </div>
    </GridCell>
  );
}
