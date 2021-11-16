import React from "react";
import { Button } from "reakit/Button";
import { CalendarState } from "./useCalendarState";

export default function TodayButton({
  onClick,
  ...calendar
}: { onClick(): void } & CalendarState) {
  return (
    <Button
      onClick={() => {
        calendar.setCurrentDay(new Date());
        onClick();
      }}
      className="inline-flex items-center py-2 px-3 text-sm font-medium leading-4 text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm focus:outline-none"
    >
      Today
    </Button>
  );
}
