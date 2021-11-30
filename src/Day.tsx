import React from "react";

import {
  unstable_GridCell as GridCell,
  unstable_GridStateReturn as GridStateReturn,
} from "reakit";
import { DateTime } from "luxon";

import classNames from "classnames";
import { CalendarState } from "./useCalendarState";

export default function Day({
  day,
  grid,
  isFirstRow,
  setTodayRef,
  ...calendar
}: CalendarState & {
  day: DateTime;
  grid: GridStateReturn;
  isFirstRow: boolean;
  setTodayRef?: boolean;
}) {
  const isFirstDay = day.day === 1;
  const isDifferentMonth = !day.hasSame(calendar.currentDay, "month");
  const isPast = day < calendar.today;
  const isToday = calendar.dateIsToday(day);

  return (
    <GridCell
      {...grid}
      as="div"
      className={classNames(
        "ak-flex-col ak-h-full ak-flex",
        isToday && "ak-bg-yellow-50",
        isFirstRow && "ak-pt-[3px]"
      )}
    >
      <div
        className={classNames(
          "ak-flex ak-justify-center ak-items-center ak-mb-1 ak-h-7 ak-text-xs ak-font-medium ak-text-center",
          !isFirstRow && "ak-mt-0.5"
        )}
        ref={isToday && setTodayRef ? calendar.__todayRef : null}
        style={{
          scrollMarginTop: "2px",
        }}
      >
        <div
          className={classNames(
            "ak-flex ak-items-center ak-justify-center ak-mx-auto",
            isDifferentMonth && "ak-text-gray-500"
          )}
        >
          {isFirstDay && (
            <div className="lg:ak-block ak-mr-1 ak-hidden">
              {day.toFormat("MMM")}
            </div>
          )}
          <div className="ak-mr-1 lg:ak-hidden">{day.toFormat("ccc")}</div>
          <div
            className={classNames(
              "ak-text-xxs ak-tracking-wide ak-tabular-nums",
              isToday &&
                "ak-bg-blue-600 ak-text-white ak-w-6 ak-h-6 ak-flex ak-rounded-full ak-items-center ak-justify-center"
            )}
          >
            {day.day}
          </div>
        </div>
      </div>
      <div className={classNames("flex-grow", isPast && "ak-opacity-50")}>
        {calendar.renderDay({
          day,
          events: calendar.events[day.toISODate()],
          calendar,
        })}
      </div>
    </GridCell>
  );
}
