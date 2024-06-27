// CalendarContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {EventInterface} from "../../../api/interface/EventInterface";

interface CalendarContextType {
    currentDate: Date;
    currentMonthName: string;
    daysOfWeek: string[];
    firstDayOfWeek: number;
    lastDayOfMonth: Date;
    events: EventInterface[];
    setEvents: React.Dispatch<React.SetStateAction<EventInterface[]>>;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = useMemo(() => [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ], []);

    const daysOfWeek = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);

    const [currentMonthName, setCurrentMonthName] = useState(monthNames[currentDate.getMonth()]);
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay());
    const [lastDayOfMonth, setLastDayOfMonth] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));

    useEffect(() => {
        setCurrentMonthName(monthNames[currentDate.getMonth()]);
        const firstDayOfMonth: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        setFirstDayOfWeek(firstDayOfMonth.getDay());
        setLastDayOfMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
    }, [currentDate, monthNames]);

    const initialEvents: EventInterface[] = [
        {
            id: 1,
            title: 'Daily Standup',
            tag: { id: 1, title: 'Meeting', color: 'RED'},
            hashtags: [{ id: 1, title: '#daily' }, { id: 2, title: '#standup' }],
            description: 'Daily team sync-up meeting',
            startDateTime: '2024-07-01T08:00:00',
            dueDateTime: '2024-07-01T08:30:00',
            location: 'Conference Room A'
        },
        {
            id: 2,
            title: 'Project Planning',
            tag: { id: 2, title: 'Workshop', color: 'ORANGE' },
            hashtags: [{ id: 3, title: '#project' }, { id: 4, title: '#planning' }],
            description: 'Planning session for the new project',
            startDateTime: '2024-07-02T10:00:00',
            dueDateTime: '2024-07-02T11:30:00',
            location: 'Conference Room B'
        },
        {
            id: 3,
            title: 'Design Review',
            tag: { id: 3, title: 'Review', color: 'YELLOW' },
            hashtags: [{ id: 5, title: '#design' }, { id: 6, title: '#review' }],
            description: 'Review of the new design mockups',
            startDateTime: '2024-07-03T13:00:00',
            dueDateTime: '2024-07-03T14:00:00',
            location: 'Conference Room C'
        },
        {
            id: 4,
            title: 'Client Meeting',
            tag: { id: 1, title: 'Meeting', color: 'GREEN' },
            hashtags: [{ id: 7, title: '#client' }, { id: 8, title: '#requirements' }],
            description: 'Meeting with the client to discuss requirements',
            startDateTime: '2024-07-04T15:00:00',
            dueDateTime: '2024-07-04T16:30:00',
            location: 'Client Office'
        },
        {
            id: 5,
            title: 'Team Drinks',
            tag: { id: 4, title: 'Social', color: 'BLUE' },
            hashtags: [{ id: 9, title: '#team' }, { id: 10, title: '#drinks' }],
            description: 'Social event with the team',
            startDateTime: '2024-07-05T17:00:00',
            dueDateTime: '2024-07-05T19:00:00',
            location: 'Local Bar'
        }
    ];

    const [events, setEvents] = useState<EventInterface[]>(initialEvents);

    const contextValue = useMemo(() => ({
        currentDate,
        currentMonthName,
        daysOfWeek,
        firstDayOfWeek,
        lastDayOfMonth,
        events,
        setEvents,
        setCurrentDate
    }), [currentDate, currentMonthName, daysOfWeek, firstDayOfWeek, lastDayOfMonth, events]);

    return (
        <CalendarContext.Provider value={contextValue}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = (): CalendarContextType => {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};
