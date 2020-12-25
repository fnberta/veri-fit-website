import React, { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import cx from 'classnames';

export const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
export const TIMES_OF_DAY = ['morning', 'midday', 'evening'] as const;

export type Weekday = typeof WEEKDAYS[number];
export type TimeOfDay = typeof TIMES_OF_DAY[number];

export interface WeekdayEntry {
  id: string;
  weekday: Weekday;
  timeOfDay: TimeOfDay;
  content: ReactNode;
}

export type Week = Record<Weekday, WeekdayEntry[]>;

interface BlockProps {
  title: string;
  entries: WeekdayEntry[];
}

const Block: FC<BlockProps> = ({ title, entries }) => (
  <>
    <h3 className="mb-2 text-center font-semibold uppercase tracking-wider">{title}</h3>
    {entries
      .slice()
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

export interface Props extends ComponentPropsWithoutRef<'div'> {
  monday: WeekdayEntry[];
  tuesday: WeekdayEntry[];
  wednesday: WeekdayEntry[];
  thursday: WeekdayEntry[];
  friday: WeekdayEntry[];
  saturday: WeekdayEntry[];
}

const WeekSchedule: FC<Props> = ({ monday, tuesday, wednesday, thursday, friday, saturday, className, ...rest }) => (
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
