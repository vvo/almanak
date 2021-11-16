import React from "react";

import type { DateTime } from "luxon";

export default function DayName({ day }: { day: DateTime }) {
  return (
    <div className="pt-1.5 text-xs font-medium text-center text-gray-500 uppercase">
      {day.toFormat("ccc")}
    </div>
  );
}
