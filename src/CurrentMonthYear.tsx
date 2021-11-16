import React from "react";
import { CalendarState } from "./useCalendarState";

export default function CurrentMonthYear({
  ...calendar
}: CalendarState): JSX.Element {
  return (
    <div className="text-lg text-gray-700">
      {calendar.currentDay.toFormat("MMMM yyyy")}
    </div>
  );
}
