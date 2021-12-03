import type { NextPage } from "next";
import { Calendar, useCalendarState } from "almanak";

const Home: NextPage = () => {
  const calendar = useCalendarState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    renderDay: CustomDay,
    events: {},
  });

  return (
    // Do not use h-screen on ios safari, it breaks scrolling
    // see https://github.com/tailwindlabs/tailwindui-issues/issues/236
    <div className="h-screen">
      <Calendar {...calendar} />
    </div>
  );
};

function CustomDay() {
  return <div></div>;
}

export default Home;
