import React from "react";
import { CalendarState } from ".";

import CurrentMonthYear from "./CurrentMonthYear";
import PrevNextNavigation from "./PrevNextNavigation";
import TodayButton from "./TodayButton";

export function Navigation({ ...calendar }: CalendarState) {
  return (
    <div className="ak-items-center ak-space-x-2 ak-flex">
      <TodayButton {...calendar} />
      <PrevNextNavigation {...calendar} />
      <CurrentMonthYear {...calendar} />
    </div>
  );
}
