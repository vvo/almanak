import type { NextPage } from "next";
import { Calendar, useCalendarState } from "almanak";

const Home: NextPage = () => {
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
};

function CustomDay(): JSX.Element {
  return <div>This text is custom</div>;
}

export default Home;
