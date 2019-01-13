import styled from '@emotion/styled';
import React from 'react';
import { Subtitle, Title } from '../components/bulma/Heading';
import ScheduleItem from '../components/ScheduleItem';

export interface ScheduleEntryData {
  title: string;
  weekday: string;
  timeOfDay: string;
  time: string;
}

export interface Props {
  entries: ScheduleEntryData[];
}

interface ByWeekday {
  [key: string]: ScheduleEntryData[];
}

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const TIMES_OF_DAY = ['morning', 'midday', 'evening'];

const Layout = styled.div({
  width: '100%',
  display: 'grid',
  gridGap: '0.75em',
  gridTemplateColumns: '1fr',
  '@media screen and (min-width: 769px)': {
    gridTemplateColumns: WEEKDAYS.map(day => `[${day}] 1fr`).join(' '),
    gridTemplateRows: `auto ${TIMES_OF_DAY.map(time => `[${time}] 1fr`).join(' ')}`,
  },
});

const ItemsBlock: React.FC<{ title: string; entries?: ScheduleEntryData[] }> = ({ title, entries }) => (
  <>
    <Subtitle className="is-marginless" text={title} size={4} />
    {entries &&
      entries.map((entry, idx) => <ScheduleItem key={`${entry.weekday}-${entry.timeOfDay}-${idx}`} {...entry} />)}
  </>
);

function getByWeekday(entries: ScheduleEntryData[]): ByWeekday {
  const byWeekday = entries.reduce<ByWeekday>((acc, curr) => {
    const list = acc[curr.weekday];
    if (list) {
      list.push(curr);
    } else {
      acc[curr.weekday] = [curr];
    }

    return acc;
  }, {});

  Object.keys(byWeekday)
    .map(key => byWeekday[key])
    .forEach(day => day.sort((a, b) => TIMES_OF_DAY.indexOf(a.timeOfDay) - TIMES_OF_DAY.indexOf(b.timeOfDay)));

  return byWeekday;
}

const Schedule: React.FC<Props> = ({ entries }) => {
  const { monday, tuesday, wednesday, thursday, friday, saturday } = getByWeekday(entries);
  return (
    <section id="schedule" className="section has-background-light">
      <div className="container has-text-centered">
        <Title text="Stundenplan" size={1} />
        <div className="content has-text-centered">
          <p>
            Die Zeiten für die Gruppenstunden findest du hier. Ich freue mich auf deinen Besuch! <br /> Um einen Termin
            für ein Personal Training zu vereinbaren, <a href="#contact">melde</a> dich doch gleich direkt bei mir.
          </p>
        </div>
        <Layout>
          <ItemsBlock title="Montag" entries={monday} />
          <ItemsBlock title="Dienstag" entries={tuesday} />
          <ItemsBlock title="Mittwoch" entries={wednesday} />
          <ItemsBlock title="Donnerstag" entries={thursday} />
          <ItemsBlock title="Freitag" entries={friday} />
          <ItemsBlock title="Samstag" entries={saturday} />
        </Layout>
      </div>
    </section>
  );
};

export default Schedule;
