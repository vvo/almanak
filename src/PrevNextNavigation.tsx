import React from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline/index.js";
import { Button } from "reakit";
import { CalendarState } from "./useCalendarState";

export default function PrevNextNavigation({ ...calendar }: CalendarState) {
  return (
    <div className="flex space-x-2 text-gray-600">
      <Button
        onClick={() => {
          calendar.prevMonth();
          calendar.scrollToTop();
        }}
        className="ak-justify-center ak-items-center ak-p-1 hover:ak-bg-gray-100 ak-rounded-full ak-flex"
      >
        <ChevronLeftIcon className="h-5" />
      </Button>
      <Button
        onClick={() => {
          calendar.nextMonth();
          calendar.scrollToTop();
        }}
        className="ak-justify-center ak-items-center ak-p-1 hover:ak-bg-gray-100 ak-rounded-full ak-flex"
      >
        <ChevronRightIcon className="h-5" />
      </Button>
    </div>
  );
}
