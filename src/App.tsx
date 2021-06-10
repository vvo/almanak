import React from "react";
import dayjs from "dayjs";
import { Calendar, useCalendarState } from "./components/Calendar";

function App(): JSX.Element {
  const calendar = useCalendarState({
    month: 6,
    year: 2021,
    renderDay: CustomDay,
  });

  return (
    <div className="h-screen">
      <Calendar {...calendar} />
    </div>
  );
}

function CustomDay(day: dayjs.Dayjs): JSX.Element {
  return <div>This text is custom</div>;
}

export default App;
