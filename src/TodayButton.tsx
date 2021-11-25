import React from "react";
import { Button } from "reakit/Button";
import { CalendarState } from "./useCalendarState";

export default function TodayButton({ ...calendar }: CalendarState) {
  return (
    <Button
      onClick={() => {
        calendar.setCurrentDay(new Date());
        calendar.scrollToToday();
      }}
      className="ak-items-center ak-py-2 ak-px-3 ak-text-sm ak-font-medium ak-leading-4 ak-text-gray-700 ak-bg-white hover:ak-bg-gray-50 ak-rounded-md ak-border ak-border-gray-300 focus:ak-ring-2 focus:ak-ring-indigo-500 focus:ak-ring-offset-2 ak-shadow-sm focus:ak-outline-none ak-inline-flex"
    >
      Today
    </Button>
  );
}
