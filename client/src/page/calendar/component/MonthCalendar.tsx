import React, { useEffect, useRef, useCallback, useState } from "react";
import { MonthCalendarHeader } from "./component/MonthCalendarHeader";
import { DayCell } from "./component/DayCell";
import { useCalendar } from "../context/CalendarContext";
import { EventInterface } from "../../../api/interface/EventInterface";
import {requestMonthlyEvents} from "../../../api/EventApi";
import {Cell} from "./component/Cell";

interface MonthInfoInterface {
    daysInMonth: number;
    firstDayOfWeek: number;
    lastDayOfWeek: number;
}

export const MonthCalendar: React.FC = () => {
    const { currentDate, setCurrentDate } = useCalendar();
    const [monthInfo, setMonthInfo] = useState<MonthInfoInterface>({
        daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
        firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
        lastDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay(),
    });

    const [events, setEvents] = useState<EventInterface[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [enableDateUpdate, setEnableDateUpdate] = useState<boolean>(true);
    const [scrollDirection, setScrollDirection] = useState<number>(0);  // 1 for down, -1 for up, and 0 for fixed
    const [scrollAmount, setScrollAmount] = useState<number>(0);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleWheel = useCallback((event: WheelEvent) => {
        event.preventDefault();
        setScrollDirection(event.deltaY > 0 ? 1 : -1);
        setScrollAmount(event.deltaY);

        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => { 
            setEnableDateUpdate(true); 
        }, 100);
    }, []);

    /*
    * UseEffects
    * */
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("wheel", handleWheel, { passive: false });
            return () => container.removeEventListener("wheel", handleWheel);
        }
    }, [handleWheel]);

    useEffect(() => {
        setMonthInfo({
            daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
            firstDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
            lastDayOfWeek: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay(),
        })
        requestMonthlyEvents(currentDate)
            .then((result) => {
                if (result) {
                    setEvents(result);
                }
            });

    }, [currentDate]);

    useEffect(() => {
        if (enableDateUpdate) {
            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + scrollDirection, 1);
            setCurrentDate(newDate);
            setEnableDateUpdate(false);
        }
    }, [scrollAmount])

    useEffect(() => {
        if (!enableDateUpdate) setScrollAmount(0);
    }, [enableDateUpdate]);
    /**/

    const getEventsForDay = (date: Date): EventInterface[] => {
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString();

        return events.filter(event => (
            (event.startDateTime <= endOfDay && event.dueDateTime >= startOfDay)
        ));
    };

    const weeksOfCurrentMonth = (): number => {
        const countOfCells = (
            monthInfo.firstDayOfWeek
            + monthInfo.daysInMonth
            + 6 - monthInfo.lastDayOfWeek
        );
        return countOfCells/7;
    };


    /*
    * rendering function
    * */
    function renderDayCells() {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        return <>
            {Array.from({length: daysInMonth}, (_, index) => {
                const day = index + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dayEvents = getEventsForDay(date);
                return (
                    <DayCell key={day} day={day} events={dayEvents}/>
                );
            })}
        </>;
    }

    function renderEmptyCells(count: number, startIndex: number) {
        return (
            <>
                {Array(count).fill(null).map((_, index) => (
                    <Cell key={startIndex + index} className="h-full w-full bg-gray-50" />
                ))}
            </>
        );
    }
    /**/


    return (
        <div
            ref={containerRef}
            style={{overflow: 'hidden', height: '90%', gridTemplateRows: '20px 1fr'}}
            className="border sm:h-2/3">
            <MonthCalendarHeader/>
            <div style={{height: '100%'}} className={`grid grid-cols-7 grid-rows-${weeksOfCurrentMonth()}`}>
                {renderEmptyCells(monthInfo.firstDayOfWeek, 0)}
                {renderDayCells()}
                {renderEmptyCells(6 - monthInfo.lastDayOfWeek, monthInfo.daysInMonth)}
            </div>
        </div>
    );
};