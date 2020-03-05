import { Link } from 'gatsby';
import React from 'react';
import WeekSchedule, { TimeOfDay, Weekday, Week } from '../components/WeekSchedule';

export interface ScheduleEntryData {
  title: string;
  weekday: Weekday;
  timeOfDay: TimeOfDay;
  time: string;
}

export interface Props {
  entries: ScheduleEntryData[];
}

export const ScheduleItem: React.FC<Pick<ScheduleEntryData, 'title' | 'time'>> = ({ title, time }) => (
  <div className="p-4 bg-white rounded shadow text-center">
    <h2 className="text-lg text-gray-900 font-semibold">{title}</h2>
    <p className="text-gray-700">{time}</p>
  </div>
);

function getWeek(entries: ScheduleEntryData[]): Week {
  return entries.reduce<Week>(
    (acc, { title, weekday, timeOfDay, time }) => {
      acc[weekday].push({
        id: `${weekday}-${timeOfDay}-${title}`,
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

const Schedule: React.FC<Props> = ({ entries }) => (
  <section id="schedule" className="bg-gray-900">
    <div className="container mx-auto px-8 py-20 text-white">
      <div className="grid lg:grid-cols-5 gap-6 items-center">
        <h1 className="lg:col-span-2 text-5xl text-orange-500 font-bold leading-tight">Stundenplan</h1>
        <div className="lg:col-span-3 text-xl text-white">
          <p>
            {
              'Ich freue mich auf deinen Besuch in einer meiner Gruppenstunden! Um einen Termin für ein Personal Training zu vereinbaren, '
            }
            <a className="link" href="/#contact">
              melde
            </a>
            {' dich doch gleich direkt bei mir.'}
          </p>
        </div>
      </div>
      <WeekSchedule className="mt-16" {...getWeek(entries)} />
      <p className="mt-16 lg:text-center">
        {'Eine Übersicht aller Stunden findest du auch in meinem aktuellen '}
        <a className="link" href="/assets/VeriFit_Flyer_Herbst19.pdf" target="_blank">
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
