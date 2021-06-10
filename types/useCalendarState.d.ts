/// <reference types="react" />
import dayjs from "dayjs";
declare type RenderDay = (day: dayjs.Dayjs) => JSX.Element;
export declare type CalendarState = {
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
};
export declare function useCalendarState(opts: {
    month: number;
    year: number;
    renderDay: RenderDay;
}): CalendarState;
export {};
