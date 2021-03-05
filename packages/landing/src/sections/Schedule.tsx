import { Link } from 'gatsby';
import React, { ComponentPropsWithoutRef, FC } from 'react';
import { TimeOfDay, Week, Weekday, WeekSchedule } from '@veri-fit/common-ui';
import cx from 'classnames';

export interface ScheduleEntryData {
  title: string;
  weekday: Weekday;
  timeOfDay: TimeOfDay;
  time: string;
}

export interface ScheduleItemProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'>,
    Pick<ScheduleEntryData, 'title' | 'time'> {}

export const ScheduleItem: FC<ScheduleItemProps> = ({ title, time, className, ...rest }) => (
  <div className={cx('p-4 bg-white rounded shadow text-center', className)} {...rest}>
    <h2 className="text-lg text-gray-900 font-semibold">{title}</h2>
    <p className="text-gray-700">{time}</p>
  </div>
);

function getWeek(entries: ScheduleEntryData[]): Week {
  return entries.reduce<Week>(
    (acc, { title, weekday, timeOfDay, time }) => {
      acc[weekday].push({
        key: `${weekday}-${timeOfDay}-${title}`,
        weekday,
        timeOfDay,
        content: <ScheduleItem title={title} time={time} />,
      });
      return acc;
    },
    {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    },
  );
}

export interface Props {
  entries: ScheduleEntryData[];
}

const Schedule: FC<Props> = ({ entries }) => (
  <section id="schedule" className="bg-gray-900">
    <div className="max-w-screen-xl mx-auto px-8 py-20 text-white">
      <header className="-ml-16 -mt-6 flex flex-wrap">
        <h1 className="ml-16 mt-6 text-5xl text-orange-500 font-bold leading-tight">Stundenplan</h1>
        <p className="w-1/2 flex-auto ml-16 mt-6 text-xl text-white">
          {
            'Ich freue mich auf deinen Besuch in einer meiner Gruppenstunden! Um einen Termin für ein Personal Training zu vereinbaren, '
          }
          <Link className="link" to="/#contact">
            melde
          </Link>
          {' dich doch gleich direkt bei mir.'}
        </p>
      </header>
      <WeekSchedule className="mt-12" {...getWeek(entries)} />
      <p className="mt-12 lg:text-center">
        {'Eine Übersicht aller Stunden findest du auch in meinem aktuellen '}
        <a className="link" href="/assets/VeriFit_Flyer_Herbst19.pdf" target="_blank" rel="noopener noreferrer">
          Flyer
        </a>
        .{' Es gelten die '}
        <Link className="link" to="/agb/">
          allgemeinen Geschäftsbedingungen
        </Link>
        .
      </p>
    </div>
  </section>
);

export default Schedule;
