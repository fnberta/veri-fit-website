import styled from '@emotion/styled';
import React from 'react';
import { ClassNameProps } from '../interfaces';
import { Subtitle } from './bulma/Heading';

export const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
export const TIMES_OF_DAY = ['morning', 'midday', 'evening'] as const;

export type Weekday = typeof WEEKDAYS[number];
export type TimeOfDay = typeof TIMES_OF_DAY[number];

export interface WeekdayEntry {
  id: string;
  weekday: Weekday;
  timeOfDay: TimeOfDay;
  content: React.ReactNode;
}

export interface Props extends ClassNameProps {
  monday: WeekdayEntry[];
  tuesday?: WeekdayEntry[];
  wednesday?: WeekdayEntry[];
  thursday?: WeekdayEntry[];
  friday?: WeekdayEntry[];
  saturday?: WeekdayEntry[];
}

const Layout = styled.div({
  width: '100%',
  display: 'grid',
  gridGap: '0.75rem',
  gridTemplateColumns: '1fr',
  '@media screen and (min-width: 769px)': {
    gridTemplateColumns: WEEKDAYS.map(day => `[${day}] 1fr`).join(' '),
    gridTemplateRows: `auto ${TIMES_OF_DAY.map(time => `[${time}] 1fr`).join(' ')}`,
  },
});

const ScheduleItem = styled.div<{ weekday: Weekday; timeOfDay: TimeOfDay }>(({ weekday, timeOfDay }) => ({
  '@media screen and (min-width: 769px)': {
    gridColumnStart: weekday,
    gridRowStart: timeOfDay,
  },
}));

const ScheduleBlock: React.FC<{ title: string; entries?: WeekdayEntry[] }> = ({ title, entries }) => (
  <>
    <Subtitle className="is-marginless has-text-centered" text={title} size={4} />
    {entries &&
      entries.map(entry => (
        <ScheduleItem key={entry.id} className="has-text-centered" weekday={entry.weekday} timeOfDay={entry.timeOfDay}>
          {entry.content}
        </ScheduleItem>
      ))}
  </>
);

const WeekSchedule: React.FC<Props> = ({ monday, tuesday, wednesday, thursday, friday, saturday, className }) => (
  <Layout className={className}>
    <ScheduleBlock title="Montag" entries={monday} />
    <ScheduleBlock title="Dienstag" entries={tuesday} />
    <ScheduleBlock title="Mittwoch" entries={wednesday} />
    <ScheduleBlock title="Donnerstag" entries={thursday} />
    <ScheduleBlock title="Freitag" entries={friday} />
    <ScheduleBlock title="Samstag" entries={saturday} />
  </Layout>
);

export default WeekSchedule;
