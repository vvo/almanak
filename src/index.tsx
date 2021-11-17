import React from "react";
import "tailwindcss/tailwind.css";

import type { DateTime } from "luxon";
import {
  unstable_Grid as Grid,
  unstable_useGridState as useGridState,
} from "reakit/Grid";
import Row from "./Row";
import { CalendarState } from "./useCalendarState";
import { throttle } from "throttle-debounce";
import { Transition } from "@headlessui/react";
import DayName from "./DayName";
import { Navigation } from "./Navigation";

export * from "./useCalendarState";

// creating this throttled function at the top (hoisted) makes it easier (unecessary)
// to deal with hooks/dependencies. And it works.
const throttledHandleWheel = throttle(
  150,
  true,
  function throttledHandleWheel(deltaY: number, calendar: CalendarState) {
    if (deltaY > 0) {
      calendar.nextMonth();
    }

    if (deltaY < 0) {
      calendar.prevMonth();
    }
  }
);

export function Calendar({ ...calendar }: CalendarState) {
  return (
    <div className="flex flex-col h-full">
      <Navigation {...calendar} />
      <div
        ref={calendar.__scrollRef}
        className="flex lg:overflow-hidden overflow-y-scroll relative flex-col lg:flex-grow h-full lg:h-auto"
      >
        <CalendarGrid
          {...calendar}
          setTodayRef={true}
          currentDay={
            calendar.__updateRequired
              ? calendar.previousDay
              : calendar.currentDay
          }
        />
        <Transition
          show={calendar.__updateRequired}
          enter="transition transform duration-300 lg:duration-150"
          className="flex absolute inset-0 flex-col"
          enterFrom="translate-x-28 opacity-25"
          enterTo="translate-x-0 opacity-100"
          afterEnter={() => {
            // weirdly this needs to be before others actions
            calendar.__updateDone();
            if (calendar.__scrollToTodayRequired) {
              calendar.scrollToToday();
            }
          }}
        >
          <CalendarGrid {...calendar} />
        </Transition>
      </div>
    </div>
  );
}

function CalendarGrid({
  setTodayRef,
  ...calendar
}: { setTodayRef?: boolean } & CalendarState) {
  return (
    <>
      <MobileMonthlyGrid setTodayRef={setTodayRef} {...calendar} />
      <DesktopMonthlyGrid {...calendar} />
    </>
  );
}

function DesktopMonthlyGrid({ ...calendar }: CalendarState) {
  // we compute the row height based on the number of rows (weeks) displayed
  const rangeStart = calendar.currentDay.startOf("month").startOf("week");
  const rangeEnd = calendar.currentDay.endOf("month").endOf("week");
  const numberOfWeeks = rangeEnd.diff(rangeStart, "days").days / 7;
  const rowHeight = `${100 / numberOfWeeks}%`;

  return (
    <div
      className="hidden lg:flex flex-col flex-grow bg-white"
      onWheel={(evt) => {
        throttledHandleWheel(evt.deltaY, calendar);
      }}
    >
      <div className="grid grid-cols-7 border-t divide-x">
        {[1, 2, 3, 4, 5, 6, 7].map((weekday, weekdayIndex) => {
          return (
            <div key={weekdayIndex}>
              <DayName day={calendar.currentDay.set({ weekday })} />
            </div>
          );
        })}
      </div>
      <MonthlyGrid
        colNumber={7}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        rowHeight={rowHeight}
        {...calendar}
      />
    </div>
  );
}

function MobileMonthlyGrid({
  setTodayRef,
  ...calendar
}: { setTodayRef?: boolean } & CalendarState) {
  const rangeStart = calendar.currentDay.startOf("month");
  const rangeEnd =
    calendar.currentDay.endOf("month").day % 2 === 1
      ? calendar.currentDay.endOf("month").plus({ days: 1 })
      : calendar.currentDay.endOf("month");

  return (
    <div className="lg:hidden bg-white">
      <MonthlyGrid
        colNumber={2}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        rowHeight="200px"
        setTodayRef={setTodayRef}
        {...calendar}
      />
    </div>
  );
}

function MonthlyGrid({
  rangeStart,
  rangeEnd,
  colNumber,
  rowHeight,
  setTodayRef,
  ...calendar
}: {
  rangeStart: DateTime;
  rangeEnd: DateTime;
  colNumber: number;
  rowHeight: string;
  setTodayRef?: boolean;
} & CalendarState) {
  let current = rangeStart;
  const range: DateTime[][] = [[]];

  while (current.startOf("day") < rangeEnd.startOf("day")) {
    range[range.length - 1].push(current);
    current = current.plus({ days: 1 });

    // if the row is full then create a new row
    if (range[range.length - 1].length === colNumber) {
      range.push([]);
    }
  }

  range[range.length - 1].push(current);

  const grid = useGridState({ loop: true, wrap: true });

  return (
    <Grid
      {...grid}
      aria-label="Days of the month"
      className="flex-grow border-t lg:border-t-0 divide-y"
    >
      {range.map((days, rowIndex) => {
        const isFirstRow = rowIndex === 0;

        return (
          <div style={{ height: rowHeight }} key={rowIndex}>
            <Row
              days={days}
              isFirstRow={isFirstRow}
              grid={grid}
              setTodayRef={setTodayRef}
              {...calendar}
            />
          </div>
        );
      })}
    </Grid>
  );
}
