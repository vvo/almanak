import React, { useState } from "react";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { unstable_Grid as Grid } from "reakit/Grid";
import { GridProvider, useGridContext } from "./GridProvider";
import Week from "./Week";
import TodayButton from "./TodayButton";
import PrevNextNavigation from "./PrevNextNavigation";
import CurrentMonthYear from "./CurrentMonthYear";
import { CalendarState } from "./useCalendarState";
import { throttle } from "throttle-debounce";
import { Transition } from "@headlessui/react";
import classNames from "classnames";

// allows for startOf("isoWeek") which always returns monday no matter the current locale
dayjs.extend(isoWeek);

type MonthRange = dayjs.Dayjs[][];

export * from "./useCalendarState";

// creating this throttled function at the top (hoisted) makes it easier (unecessary)
// to deal with hooks/dependencies. And it works.
const throttledHandleWheel = throttle(
  500,
  true,
  function throttledHandleWheel(deltaY, calendar) {
    if (deltaY > 0) {
      calendar.next();
    }

    if (deltaY < 0) {
      calendar.prev();
    }
  }
);

export function Calendar({ ...calendar }: CalendarState): JSX.Element {
  const [previousState, setPreviousState] = useState(calendar);

  console.log(calendar.__updateRequired, "coucou");

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 flex space-x-4 items-center">
        <TodayButton {...calendar} />
        <PrevNextNavigation {...calendar} />
        <CurrentMonthYear {...calendar} />
      </div>
      <div
        className="flex-grow relative overflow-hidden"
        onWheel={(evt) => {
          setPreviousState(calendar);
          throttledHandleWheel(evt.deltaY, calendar);
        }}
      >
        <GridProvider loop wrap>
          <CalendarGrid
            {...(calendar.__updateRequired ? previousState : calendar)}
          />
        </GridProvider>
        <Transition
          show={calendar.__updateRequired}
          enter="transition transform duration-175"
          className="absolute inset-0 bg-white"
          enterFrom="translate-x-28 opacity-25"
          enterTo="translate-x-0 opacity-100"
          afterEnter={() => {
            calendar.__updateDone();
          }}
        >
          <GridProvider loop wrap>
            <CalendarGrid {...calendar} />
          </GridProvider>
        </Transition>
      </div>
    </div>
  );
}

function CalendarGrid({
  className = "",
  ...calendar
}: CalendarState & { className?: string }) {
  const rangeStart = calendar.currentDay.startOf("month").startOf("isoWeek");
  const rangeEnd = calendar.currentDay.endOf("month").endOf("isoWeek");

  let current = rangeStart;
  const range: MonthRange = [];
  while (current.isBefore(rangeEnd, "day")) {
    if (current.day() === 1) {
      range.push([]);
    }

    range[range.length - 1].push(current);
    current = current.add(1, "day");
  }
  range[range.length - 1].push(current);

  const grid = useGridContext();
  const weekHeightInPercent = 100 / range.length;

  return (
    <Grid
      {...grid}
      aria-label="Days of the month"
      className={classNames("h-full border-t w-full", className)}
    >
      {range.map((days, weekIndex) => {
        return (
          <div style={{ height: `${weekHeightInPercent}%` }} key={weekIndex}>
            <Week days={days} isFirstWeek={weekIndex === 0} {...calendar} />
          </div>
        );
      })}
    </Grid>
  );
}
