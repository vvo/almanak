import React from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { Button } from "reakit/Button";
import { CalendarState } from "./useCalendarState";

export default function PrevNextNavigation({ ...calendar }: CalendarState) {
  return (
    <div className="flex space-x-2 text-gray-600">
      <Button
        onClick={() => {
          calendar.prev();
        }}
        className="flex justify-center items-center p-1 hover:bg-gray-100 rounded-full"
      >
        <ChevronLeftIcon className="h-5" />
      </Button>
      <Button
        onClick={() => {
          calendar.next();
        }}
        className="flex justify-center items-center p-1 hover:bg-gray-100 rounded-full"
      >
        <ChevronRightIcon className="h-5" />
      </Button>
    </div>
  );
}
