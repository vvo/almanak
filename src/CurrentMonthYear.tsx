import React from "react";
import { CalendarState } from "./useCalendarState";

export default function CurrentMonthYear({
  ...calendar
}: CalendarState): JSX.Element {
  return (
    <div className="ak-text-gray-700 ak-text-md">
      {calendar.currentDay.toFormat("MMMM yyyy")}
    </div>
  );
}
