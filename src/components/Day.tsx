import React from "react";
import { unstable_GridCell as GridCell } from "reakit/Grid";
import { useGridContext } from "./GridProvider";
import dayjs from "dayjs";
import classNames from "classnames";
import { CalendarState } from "./useCalendarState";
import { textXxs } from "./styles";

export default function Day({
  day,
  isFirstWeek,
  ...calendar
}: CalendarState & { day: dayjs.Dayjs; isFirstWeek: boolean }): JSX.Element {
  const grid = useGridContext();
  const isFirstDay = day.date() === 1;
  const isToday = day.isSame(dayjs(), "day");
  const isDifferentMonth = !day.isSame(calendar.currentDay, "month");

  return (
    <GridCell {...grid} as="div">
      <div
        className={classNames(
          "border-r h-full",
          !isFirstWeek && "border-t",
          isFirstWeek && "pt-2"
        )}
      >
        <div className="text-center font-medium mb-1" style={textXxs}>
          {isFirstWeek && <DayName day={day} />}
          <div
            className={classNames(
              "rounded-full inline-flex items-center justify-center mx-auto h-6",
              !isFirstDay && "w-6",
              isToday ? "bg-blue-600 text-white mt-1" : "h-5",
              !isToday && !isFirstWeek && "mt-1",
              isDifferentMonth && "text-gray-500"
            )}
          >
            {isFirstDay && `${day.format("MMM")} `}
            {day.date()}
          </div>
        </div>
        {calendar.renderDay(day)}
      </div>
    </GridCell>
  );
}

function DayName({ day }: { day: dayjs.Dayjs }) {
  return <div className="text-gray-500 uppercase">{day.format("ddd")}</div>;
}
