import { DateTime } from "luxon";

import { useRef, useState } from "react";

type RenderDay = (day: DateTime) => JSX.Element;

export type CalendarState = ReturnType<typeof useCalendarState>;

export function useCalendarState({
  month,
  year,
  renderDay,
}: {
  month: number;
  year: number;
  renderDay: RenderDay;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  const [currentDay, setInternalCurrentDay] = useState(
    DateTime.fromObject({
      year,
      month,
    })
  );

  const [previousDay, setInternalPreviousDay] = useState(
    DateTime.fromObject({
      year,
      month,
    })
  );
  const [updateRequired, setUpdateRequired] = useState(false);
  const [scrollToTodayRequired, setScrollToTodayRequired] = useState(false);

  return {
    // year,
    // month,
    currentDay,
    previousDay,
    setCurrentDay(date: Date) {
      const newDate = DateTime.fromJSDate(date);

      if (newDate.startOf("day").hasSame(currentDay.startOf("day"), "month")) {
        return;
      }

      setInternalPreviousDay(currentDay);
      setInternalCurrentDay(newDate);
      setUpdateRequired(true);
    },
    nextMonth() {
      setInternalPreviousDay(currentDay);
      setInternalCurrentDay(currentDay.plus({ months: 1 }));
      setUpdateRequired(true);
    },
    prevMonth() {
      setInternalPreviousDay(currentDay);
      setInternalCurrentDay(currentDay.minus({ months: 1 }));
      setUpdateRequired(true);
    },
    renderDay,
    scrollToToday(async = false) {
      if (todayRef.current) {
        todayRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }

      // this is needed because the todayRef will only be set when the transition is finished
      if (async) {
        setScrollToTodayRequired(true);
      } else {
        setScrollToTodayRequired(false);
      }
    },
    scrollToTop() {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    },
    __updateRequired: updateRequired,
    __updateDone() {
      setUpdateRequired(false);
    },
    __scrollRef: scrollRef,
    __todayRef: todayRef,
    __scrollToTodayRequired: scrollToTodayRequired,
  };
}
