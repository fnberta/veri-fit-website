import styled from '@emotion/styled';
import React from 'react';
import { Subtitle, Title } from '../components/bulma/Heading';
import ScheduleItem from '../components/ScheduleItem';

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export type TimeOfDay = 'morning' | 'midday' | 'evening';

export interface ScheduleEntryData {
  title: string;
  weekday: Weekday;
  timeOfDay: TimeOfDay;
  time: string;
}

export interface Props {
  entries: ScheduleEntryData[];
}

type ByWeekday = { [key in Weekday]?: ScheduleEntryData[] };

const Layout = styled.div({
  width: '100%',
  display: 'grid',
  gridGap: '0.75em',
  gridTemplateColumns: '1fr',
  '@media screen and (min-width: 769px)': {
    gridTemplateColumns: '[monday] 1fr [tuesday] 1fr [wednesday] 1fr [thursday] 1fr [friday] 1fr [saturday] 1fr',
    gridTemplateRows: 'auto [morning] 1fr [midday] 1fr [evening] 1fr',
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
  return entries.reduce<ByWeekday>((acc, curr) => {
    const list = acc[curr.weekday];
    if (list) {
      list.push(curr);
    } else {
      acc[curr.weekday] = [curr];
    }

    return acc;
  }, {});
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
