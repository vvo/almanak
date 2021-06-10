import dayjs from "dayjs";

import { useState } from "react";

type RenderDay = (day: dayjs.Dayjs) => JSX.Element;

export type CalendarState = {
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  next: () => void;
  prev: () => void;
  /**
   * Current day represent the year/month as a dayjs instance.
   * We name it `currentDay` so it does not conflicts with other props like `day`
   * far in the tree
   */
  currentDay: dayjs.Dayjs;
  setCurrentDay: (date: Date) => void;
  renderDay: RenderDay;
  __updateRequired: boolean;
  __updateDone: () => void;
};

export function useCalendarState(opts: {
  month: number;
  year: number;
  renderDay: RenderDay;
}): CalendarState {
  const [month, setMonth] = useState(opts.month);
  const [year, setYear] = useState(opts.year);
  const [currentDay, setInternalCurrentDay] = useState(
    dayjs(new Date(year, month - 1))
  );
  const [updateRequired, setUpdateRequired] = useState(false);

  return {
    year,
    month,
    currentDay,
    setCurrentDay(date) {
      setInternalCurrentDay(dayjs(date));
      setUpdateRequired(true);
    },
    setMonth,
    setYear,
    next() {
      setInternalCurrentDay(currentDay.add(1, "month"));
      setUpdateRequired(true);
    },
    prev() {
      setInternalCurrentDay(currentDay.subtract(1, "month"));
      setUpdateRequired(true);
    },
    renderDay: opts.renderDay,
    __updateRequired: updateRequired,
    __updateDone() {
      setUpdateRequired(false);
    },
  };
}
