import React from "react";
import { Button } from "reakit";
import { CalendarState } from "./useCalendarState";

export default function TodayButton({ ...calendar }: CalendarState) {
  return (
    <Button
      onClick={() => {
        calendar.setCurrentDay(new Date());
        calendar.scrollToToday();
      }}
      className="ak-items-center ak-py-1.5 sm:ak-py-2 ak-px-1.5 sm:ak-px-3 ak-text-xs sm:ak-text-sm ak-leading-4 ak-text-gray-700 ak-bg-white hover:ak-bg-gray-50 ak-rounded-md ak-border ak-border-gray-300 focus:ak-ring-2 focus:ak-ring-indigo-500 focus:ak-ring-offset-2 ak-shadow-sm focus:ak-outline-none ak-inline-flex"
    >
      Today
    </Button>
  );
}
