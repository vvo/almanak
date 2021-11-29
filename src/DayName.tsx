import React from "react";

import type { DateTime } from "luxon";
import { CalendarState } from ".";
import classNames from "classnames";

export default function DayName({
  day,
  ...calendar
}: CalendarState & {
  day: DateTime;
}) {
  const isToday = calendar.dateIsToday(day);
  const isCurrentWeekday = calendar.dateIsCurrentWeekday(day);

  return (
    <div
      className={classNames(
        "ak-pt-1.5 ak-text-xs ak-text-center ak-uppercase",
        isToday && "ak-bg-yellow-50",
        isCurrentWeekday
          ? "ak-text-gray-700 ak-font-bold"
          : "ak-font-medium ak-text-gray-500"
      )}
    >
      {day.toFormat("ccc")}
    </div>
  );
}
