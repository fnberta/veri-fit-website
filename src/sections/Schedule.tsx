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
    <h2 className="text-lg font-semibold">{title}</h2>
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

const Schedule: React.FC<Props> = ({ entries }) => {
  return (
    <section id="schedule" className="bg-gray-100">
      <div className="container mx-auto px-8 py-20 text-center">
        <div className="flex flex-col items-center">
          <h1 className="section-header">Stundenplan</h1>
          <p className="max-w-3xl mt-4 text-xl text-gray-700 leading-snug">
            {
              'Die Zeiten für die Gruppenstunden findest du hier. Ich freue mich auf deinen Besuch! Um einen Termin für ein Personal Training zu vereinbaren, '
            }
            <a className="link" href="/#contact">
              melde
            </a>
            {' dich doch gleich direkt bei mir.'}
          </p>
        </div>
        <WeekSchedule className="mt-8" {...getWeek(entries)} />
        <p className="mt-8 text-lg text-center">
          {'Eine Übersicht aller Stunden findest du auch in meinem aktuellen '}
          <a className="link" href="/assets/VeriFit_Flyer_Herbst19.pdf" target="_blank">
            Flyer
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default Schedule;
