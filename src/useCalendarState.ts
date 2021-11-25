import { DateTime, Interval } from "luxon";

import { useEffect, useRef, useState } from "react";

const rageClickInterval = 500;

type RenderDay<T = unknown> = ({
  day,
  events,
  maxEventsPerLine,
}: {
  day: DateTime;
  maxEventsPerLine: number;
  events: T[];
}) => JSX.Element | null;

export type CalendarState = ReturnType<typeof useCalendarState>;

export function useCalendarState<T = unknown>({
  month,
  year,
  renderDay,
  events,
}: {
  month: number;
  year: number;
  renderDay: RenderDay<T>;
  events: Record<string, T[]>;
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
  const [lastClick, setLastClick] = useState(Date.now());
  const [fastClick, setFastClick] = useState(false);
  const [updateRequired, setUpdateRequired] = useState(false);

  const [scrollToTodayRequired, setScrollToTodayRequired] = useState(false);

  const [maxEventsPerLine, setMaxEventsPerLine] = useState(5);

  useEffect(() => {
    if (scrollRef.current) {
      const numberOfWeeksThisMonth = Interval.fromDateTimes(
        currentDay.startOf("month").startOf("week").startOf("day"),
        currentDay.endOf("month").endOf("week").plus({ days: 1 }).startOf("day")
      ).length("week");

      const height =
        scrollRef.current.clientHeight -
        22 - // MON - TUE ...
        numberOfWeeksThisMonth * 28; // Day number;

      const dayHeight = height / numberOfWeeksThisMonth;
      setMaxEventsPerLine(Math.floor(dayHeight / 20 - 1));
    }
  }, [currentDay]);

  // We can't just scroll to todayRef at every click on "Today"
  // Because when today is in a different month than the current one then todayRef will
  // only be available once render is done. This useEffect is here to tackle that.
  // The important part being the dependency on todayRef.current AND scrollToTodayRequired
  useEffect(() => {
    if (scrollToTodayRequired && todayRef.current) {
      // We need to wrap the scroll in requestAnimationFrame because it's an animation (smooth)
      // See https://github.com/facebook/react/issues/20770
      requestAnimationFrame(() => {
        if (todayRef.current) {
          todayRef.current.scrollIntoView({
            behavior: "smooth",
          });
        }
      });

      setScrollToTodayRequired(false);
    }
  }, [scrollToTodayRequired, todayRef.current]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const numberOfWeeksThisMonth = Interval.fromDateTimes(
        currentDay.startOf("month").startOf("week").startOf("day"),
        currentDay.endOf("month").endOf("week").plus({ days: 1 }).startOf("day")
      ).length("week");

      const height =
        entries[0].contentBoxSize[0].blockSize -
        22 - // MON - TUE ...
        numberOfWeeksThisMonth * 28; // Day number;

      const dayHeight = height / numberOfWeeksThisMonth;
      setMaxEventsPerLine(Math.floor(dayHeight / 20 - 1));
    });

    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [scrollRef.current, currentDay]);

  return {
    currentDay,
    previousDay,
    setCurrentDay(date: Date) {
      setInternalPreviousDay(currentDay);

      const newDate = DateTime.fromJSDate(date);

      if (newDate.startOf("day").hasSame(currentDay.startOf("day"), "month")) {
        return;
      }

      setInternalCurrentDay(newDate);
      const clickDiff = Date.now() - lastClick;
      if (clickDiff < rageClickInterval) {
        setFastClick(true);
      } else {
        setFastClick(false);
        setUpdateRequired(true);
      }
      setLastClick(Date.now());
    },
    nextMonth() {
      setInternalPreviousDay(currentDay);
      setInternalCurrentDay(currentDay.plus({ months: 1 }));
      const clickDiff = Date.now() - lastClick;
      if (clickDiff < rageClickInterval) {
        setFastClick(true);
      } else {
        setFastClick(false);
        setUpdateRequired(true);
      }
      setLastClick(Date.now());
    },
    prevMonth() {
      setInternalPreviousDay(currentDay);
      setInternalCurrentDay(currentDay.minus({ months: 1 }));
      const clickDiff = Date.now() - lastClick;
      if (clickDiff < rageClickInterval) {
        setFastClick(true);
      } else {
        setFastClick(false);
        setUpdateRequired(true);
      }
      setLastClick(Date.now());
    },
    scrollToToday() {
      setScrollToTodayRequired(true);
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
    events,
    maxEventsPerLine,
    renderDay,
    fastClick,
    __updateRequired: updateRequired,
    __updateDone: () => {
      setUpdateRequired(false);
      if (scrollToTodayRequired) {
        requestAnimationFrame(() => {
          if (todayRef.current) {
            todayRef.current.scrollIntoView({
              behavior: "smooth",
            });
          }
        });
        setScrollToTodayRequired(false);
      }
    },
    __scrollRef: scrollRef,
    __todayRef: todayRef,
  } as const;
}
