import React from "react";

import type { DateTime } from "luxon";

export default function DayName({ day }: { day: DateTime }) {
  return (
    <div className="ak-pt-1.5 ak-text-xs ak-font-medium ak-text-center ak-text-gray-500 ak-uppercase">
      {day.toFormat("ccc")}
    </div>
  );
}
