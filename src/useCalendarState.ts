import { DateTime } from "luxon";

import { useState } from "react";

type RenderDay = (day: DateTime) => JSX.Element;

export type CalendarState = {
  // month: number;
  // year: number;
  nextMonth: () => void;
  prevMonth: () => void;
  /**
   * Current day represent the year/month as a DateTime (luxon) instance.
   * We name it `currentDay` so it does not conflicts with other props like `day`
   * far in the tree
   */
  currentDay: DateTime;
  previousDay: DateTime;
  setCurrentDay: (date: Date) => void;
  renderDay: RenderDay;
  __updateRequired: boolean;
  __updateDone: () => void;
};

export function useCalendarState({
  month,
  year,
  renderDay,
}: {
  month: number;
  year: number;
  renderDay: RenderDay;
}) {
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
    __updateRequired: updateRequired,
    __updateDone() {
      setUpdateRequired(false);
    },
  };
}
