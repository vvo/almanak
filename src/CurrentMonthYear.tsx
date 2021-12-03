import React from "react";
import { CalendarState } from "./useCalendarState";

export default function CurrentMonthYear({
  ...calendar
}: CalendarState): JSX.Element {
  return (
    <div className="ak-text-gray-700 ak-text-sm sm:ak-text-lg">
      {calendar.currentDay.toFormat("MMMM yyyy")}
    </div>
  );
}
