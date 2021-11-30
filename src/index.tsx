import React from "react";
import "tailwindcss/tailwind.css";
import { Transition } from "@headlessui/react";
import type { DateTime } from "luxon";
import {
  unstable_Grid as Grid,
  unstable_useGridState as useGridState,
} from "reakit";
import Row from "./Row";
import { CalendarState } from "./useCalendarState";
import DayName from "./DayName";

export * from "./useCalendarState";
export * from "./Navigation";

export function Calendar({ ...calendar }: CalendarState) {
  return (
    <div
      ref={calendar.__scrollRef}
      className="lg:ak-overflow-hidden ak-overflow-y-scroll ak-flex-col lg:ak-flex-1 ak-h-full lg:ak-h-auto ak-flex ak-relative"
    >
      {calendar.fastClick === true ? (
        <CalendarGrid setTodayRef={true} {...calendar} />
      ) : (
        <>
          <Transition
            show={calendar.__updateRequired === false}
            className="ak-z-20 ak-flex-col ak-flex-1 ak-bg-white ak-ease-linear ak-relative ak-flex"
            leave="ak-transition-opacity ak-duration-200"
            leaveFrom="ak-opacity-50"
            leaveTo="ak-opacity-0"
            style={{
              willChange: "opacity",
            }}
            appear
            unmount={false}
          >
            <CalendarGrid
              {...calendar}
              setTodayRef={true}
              currentDay={
                calendar.__updateRequired !== false
                  ? calendar.previousDay
                  : calendar.currentDay
              }
            />
          </Transition>
          <Transition
            show={calendar.__updateRequired !== false}
            className="ak-inset-0 ak-z-10 ak-flex-col ak-bg-white ak-flex ak-absolute"
            enter="ak-transition ak-transform-gpu ak-duration-150 ak-ease-in-out"
            enterFrom={
              calendar.__updateRequired === "prev"
                ? "ak--translate-x-10 ak-opacity-20"
                : "ak-translate-x-10 ak-opacity-20"
            }
            enterTo="ak-translate-x-[-0.1px] ak-opacity-100"
            afterEnter={() => {
              calendar.__updateDone();
            }}
            style={{ willChange: "transform,opacity" }}
            unmount={false}
          >
            <CalendarGrid {...calendar} />
          </Transition>
        </>
      )}
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
    <div className="ak-flex-col ak-h-full ak-hidden lg:ak-flex">
      <div className="ak-grid-cols-7 ak-divide-x ak-grid">
        {[1, 2, 3, 4, 5, 6, 7].map((weekday, weekdayIndex) => {
          return (
            <div key={weekdayIndex}>
              <DayName day={rangeStart.set({ weekday })} {...calendar} />
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
    <div className="lg:ak-hidden">
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
      className="ak-overflow-hidden ak-flex-1 ak-divide-y"
    >
      {range.map((days, rowIndex) => {
        const isFirstRow = rowIndex === 0;

        return (
          <div
            style={{ height: rowHeight }}
            className="ak-overflow-hidden"
            key={rowIndex}
          >
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
