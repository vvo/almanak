import React from "react";
import { Button } from "reakit/Button";
import { CalendarState } from "./useCalendarState";

export default function TodayButton({
  ...calendar
}: CalendarState): JSX.Element {
  return (
    <Button
      onClick={() => {
        calendar.setCurrentDay(new Date());
      }}
      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Today
    </Button>
  );
}
