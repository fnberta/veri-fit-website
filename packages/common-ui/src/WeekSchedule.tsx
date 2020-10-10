import React from 'react';
import cx from 'classnames';

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

export interface Props extends React.HTMLProps<HTMLDivElement> {
  monday: WeekdayEntry[];
  tuesday: WeekdayEntry[];
  wednesday: WeekdayEntry[];
  thursday: WeekdayEntry[];
  friday: WeekdayEntry[];
  saturday: WeekdayEntry[];
}

export type Week = Record<Weekday, WeekdayEntry[]>;

const Block: React.FC<{ title: string; entries: WeekdayEntry[] }> = ({ title, entries }) => (
  <>
    <h3 className="mb-2 text-center font-semibold uppercase tracking-wider">{title}</h3>
    {entries
      .sort((a, b) => TIMES_OF_DAY.indexOf(a.timeOfDay) - TIMES_OF_DAY.indexOf(b.timeOfDay))
      .map((entry) => (
        <div
          key={entry.id}
          className={cx('flex flex-col items-stretch', `schedule-${entry.weekday} schedule-${entry.timeOfDay}`)}
        >
          {entry.content}
        </div>
      ))}
  </>
);

const WeekSchedule: React.FC<Props> = ({
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  className,
  ...rest
}) => (
  <div className={cx('schedule-grid', className)} {...rest}>
    <Block title="Montag" entries={monday} />
    <Block title="Dienstag" entries={tuesday} />
    <Block title="Mittwoch" entries={wednesday} />
    <Block title="Donnerstag" entries={thursday} />
    <Block title="Freitag" entries={friday} />
    <Block title="Samstag" entries={saturday} />
  </div>
);

export default WeekSchedule;
