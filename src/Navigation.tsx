import React from "react";
import { CalendarState } from ".";

import CurrentMonthYear from "./CurrentMonthYear";
import PrevNextNavigation from "./PrevNextNavigation";
import TodayButton from "./TodayButton";

export function Navigation({ ...calendar }: CalendarState) {
  return (
    <div className="flex items-center p-3 space-x-4">
      <TodayButton {...calendar} />
      <PrevNextNavigation {...calendar} />
      <CurrentMonthYear {...calendar} />
    </div>
  );
}
