import React, { RefObject, useRef, useState } from "react";

import type { DateTime } from "luxon";
import {
  unstable_Grid as Grid,
  unstable_useGridState as useGridState,
} from "reakit/Grid";
import Row from "./Row";
import TodayButton from "./TodayButton";
import PrevNextNavigation from "./PrevNextNavigation";
import CurrentMonthYear from "./CurrentMonthYear";
import { CalendarState } from "./useCalendarState";
import { throttle } from "throttle-debounce";
import { Transition } from "@headlessui/react";
import DayName from "./DayName";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const [todayButtonClicked, setTodayButtonClicked] = useState(false);

  function scrollToTop() {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }

  function scrollToToday() {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-3 space-x-4">
        <TodayButton
          {...calendar}
          onClick={() => {
            // when we're already on the current month
            scrollToToday();

            // when we're on a different month, it will be handled by the transition end
            setTodayButtonClicked(true);
          }}
        />
        <PrevNextNavigation {...calendar} onClick={scrollToTop} />
        <CurrentMonthYear {...calendar} />
      </div>
      <div
        ref={scrollRef}
        className="flex lg:overflow-hidden overflow-y-scroll relative flex-col lg:flex-grow h-full lg:h-auto"
      >
        <CalendarGrid
          {...calendar}
          currentDay={
            calendar.__updateRequired
              ? calendar.previousDay
              : calendar.currentDay
          }
          todayRef={todayRef}
        />
        <Transition
          show={calendar.__updateRequired}
          enter="transition transform duration-175"
          className="flex absolute inset-0 flex-col bg-white"
          enterFrom="translate-x-28 opacity-25"
          enterTo="translate-x-0 opacity-100"
          afterEnter={() => {
            calendar.__updateDone();
            if (todayButtonClicked) {
              scrollToToday();
            }
            setTodayButtonClicked(false);
          }}
        >
          <CalendarGrid {...calendar} />
        </Transition>
      </div>
    </div>
  );
}

function CalendarGrid({
  todayRef,
  ...calendar
}: { todayRef?: RefObject<HTMLDivElement> } & CalendarState) {
  return (
    <>
      <MobileMonthlyGrid todayRef={todayRef} {...calendar} />
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
      className="hidden lg:flex flex-col flex-grow"
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
  todayRef,
  ...calendar
}: { todayRef?: RefObject<HTMLDivElement> } & CalendarState) {
  const rangeStart = calendar.currentDay.startOf("month");
  const rangeEnd =
    calendar.currentDay.endOf("month").day % 2 === 1
      ? calendar.currentDay.endOf("month").plus({ days: 1 })
      : calendar.currentDay.endOf("month");

  return (
    <div className="lg:hidden">
      <MonthlyGrid
        colNumber={2}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        rowHeight="200px"
        todayRef={todayRef}
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
  todayRef,
  ...calendar
}: {
  rangeStart: DateTime;
  rangeEnd: DateTime;
  colNumber: number;
  rowHeight: string;
  todayRef?: RefObject<HTMLDivElement>;
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
              todayRef={todayRef}
              {...calendar}
            />
          </div>
        );
      })}
    </Grid>
  );
}
