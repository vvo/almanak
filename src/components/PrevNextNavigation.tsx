import React from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { Button } from "reakit/Button";
import { CalendarState } from "./useCalendarState";

export default function PrevNextNavigation({
  ...calendar
}: CalendarState): JSX.Element {
  return (
    <div className="space-x-2 text-gray-600 flex">
      <Button
        onClick={() => {
          calendar.prev();
        }}
        className="rounded-full hover:bg-gray-100 flex items-center justify-center p-1"
      >
        <ChevronLeftIcon className="h-5" />
      </Button>
      <Button
        onClick={() => {
          calendar.next();
        }}
        className="rounded-full hover:bg-gray-100 flex items-center justify-center p-1"
      >
        <ChevronRightIcon className="h-5" />
      </Button>
    </div>
  );
}
