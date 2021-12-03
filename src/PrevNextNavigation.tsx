import React from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline/index.js";
import { Button } from "reakit";
import { CalendarState } from "./useCalendarState";

export default function PrevNextNavigation({ ...calendar }: CalendarState) {
  return (
    <div className="ak-flex ak-text-gray-600 sm:ak-space-x-2 ak-space-x-1.5">
      <Button
        onClick={() => {
          calendar.prevMonth();
        }}
        className="ak-justify-center ak-items-center ak-p-1 hover:ak-bg-gray-100 ak-rounded-full ak-flex"
      >
        <ChevronLeftIcon className="ak-h-5" />
      </Button>
      <Button
        onClick={() => {
          calendar.nextMonth();
        }}
        className="ak-justify-center ak-items-center ak-p-1 hover:ak-bg-gray-100 ak-rounded-full ak-flex"
      >
        <ChevronRightIcon className="ak-h-5" />
      </Button>
    </div>
  );
}
