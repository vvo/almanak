import type { NextPage } from "next";
import { Calendar, useCalendarState } from "almanak";

const Home: NextPage = () => {
  const calendar = useCalendarState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    renderDay: CustomDay,
  });

  return (
    <div className="h-screen">
      <Calendar {...calendar} />
    </div>
  );
};

function CustomDay(): JSX.Element {
  return <div></div>;
}

export default Home;
