import React from "react";
import { CalendarState } from "./useCalendarState";

export default function CurrentMonthYear({
  ...calendar
}: CalendarState): JSX.Element {
  return (
    <div className="text-gray-700 text-lg">
      {calendar.currentDay.format("MMMM YYYY")}
    </div>
  );
}
