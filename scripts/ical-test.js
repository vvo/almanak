const fs = require("fs");
const ICAL = require("ical.js");

const icalData = fs.readFileSync("./scripts/basic.ics", "utf-8");
const jcal = ICAL.parse(icalData);
const vcal = new ICAL.Component(jcal);
const vevents = vcal.getAllSubcomponents("vevent");
console.log(
  vevents.map((vevent) => {
    const event = new ICAL.Event(vevent);
    return {
      summary: event.summary,
      startDate: event.startDate.toJSDate(),
      endDate: event.endDate.toJSDate(),
    };
  })
);
