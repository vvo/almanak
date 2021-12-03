import { DateTime, Interval } from "luxon";

import { useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import useMedia from "./useMedia";

const rageClickInterval = 500;

type RenderDay<T = unknown> = ({
  day,
  events,
  calendar,
}: {
  day: DateTime;
  calendar: ReturnType<typeof useCalendarState>;
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
  const today = DateTime.local().startOf("day");
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const isLg = useMedia("(min-width: 1024px)");
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
  const [updateRequired, setUpdateRequired] = useState<"prev" | "next" | false>(
    false
  );

  const [scrollToTodayRequired, setScrollToTodayRequired] = useState(false);

  const [maxEventsPerLine, setMaxEventsPerLine] = useState(5);

  useEffect(() => {
    if (scrollRef.current && isLg) {
      const numberOfWeeksThisMonth = Interval.fromDateTimes(
        currentDay.startOf("month").startOf("week").startOf("day"),
        currentDay.endOf("month").endOf("week").plus({ days: 1 }).startOf("day")
      ).length("week");

      const height =
        scrollRef.current.clientHeight -
        22 - // MON - TUE ...
        numberOfWeeksThisMonth * 28; // Day number;

      const dayHeight = height / numberOfWeeksThisMonth;
      requestAnimationFrame(() => {
        setMaxEventsPerLine(Math.floor(dayHeight / 20 - 1));
      });
    } else {
      requestAnimationFrame(() => {
        setMaxEventsPerLine(Math.floor(165 / 20 - 1));
      });
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
          requestAnimationFrame(() => {
            setScrollToTodayRequired(false);
          });
        }
      });
    }
  }, [scrollToTodayRequired, todayRef.current]);

  useEffect(() => {
    let timer!: ReturnType<typeof setTimeout>;
    if (fastClick === true) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setFastClick(false);
      }, rageClickInterval);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [fastClick]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const numberOfWeeksThisMonth = Interval.fromDateTimes(
        currentDay.startOf("month").startOf("week").startOf("day"),
        currentDay.endOf("month").endOf("week").plus({ days: 1 }).startOf("day")
      ).length("week");

      const scrollHeight = entries[0].contentBoxSize
        ? entries[0].contentBoxSize[0].blockSize
        : entries[0].contentRect.height;

      const height =
        scrollHeight -
        22 - // MON - TUE ...
        numberOfWeeksThisMonth * 32; // Day number;

      const dayHeight = height / numberOfWeeksThisMonth;
      requestAnimationFrame(() => {
        setMaxEventsPerLine(Math.floor(dayHeight / 20 - 1));
      });
    });

    if (scrollRef.current && isLg) {
      resizeObserver.observe(scrollRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [scrollRef.current, currentDay]);

  return {
    currentDay,
    previousDay,
    today,
    setCurrentDay(date: Date) {
      unstable_batchedUpdates(() => {
        setInternalPreviousDay(currentDay);

        const newDate = DateTime.fromJSDate(date);

        if (
          newDate.startOf("day").hasSame(currentDay.startOf("day"), "month")
        ) {
          return;
        }

        const clickDiff = Date.now() - lastClick;
        if (clickDiff < rageClickInterval) {
          setFastClick(true);
          setUpdateRequired(false);
        } else {
          setFastClick(false);
          if (newDate > currentDay) {
            setUpdateRequired("next");
          } else {
            setUpdateRequired("prev");
          }
        }
        setLastClick(Date.now());
        setInternalCurrentDay(newDate);
      });
    },
    nextMonth() {
      unstable_batchedUpdates(() => {
        setInternalPreviousDay(currentDay);
        setInternalCurrentDay(currentDay.plus({ months: 1 }));
        const clickDiff = Date.now() - lastClick;
        if (clickDiff < rageClickInterval) {
          setFastClick(true);
          setUpdateRequired(false);
        } else {
          setFastClick(false);
          setUpdateRequired("next");
        }
        setLastClick(Date.now());
      });
    },
    prevMonth() {
      unstable_batchedUpdates(() => {
        setInternalPreviousDay(currentDay);
        setInternalCurrentDay(currentDay.minus({ months: 1 }));
        const clickDiff = Date.now() - lastClick;
        if (clickDiff < rageClickInterval) {
          setFastClick(true);
          setUpdateRequired(false);
        } else {
          setFastClick(false);
          setUpdateRequired("prev");
        }
        setLastClick(Date.now());
      });
    },
    scrollToToday() {
      setScrollToTodayRequired(true);
    },
    events,
    maxEventsPerLine,
    dateIsToday(date: DateTime) {
      return date.startOf("day").equals(today);
    },
    dateIsCurrentMonth(date: DateTime) {
      return date.hasSame(today, "month");
    },
    dateIsCurrentWeekday(date: DateTime) {
      return date.weekday === today.weekday && date.hasSame(today, "month");
    },
    renderDay,
    fastClick,
    __updateRequired: updateRequired,
    __updateDone: () => {
      setUpdateRequired(false);
    },
    __scrollRef: scrollRef,
    __todayRef: todayRef,
  } as const;
}
