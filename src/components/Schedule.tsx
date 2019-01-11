import styled from '@emotion/styled';
import React from 'react';

export interface ScheduleEntry {
  day: string;
  time: string;
}

export interface Props {
  entries: ScheduleEntry[];
}

const EntryLayout = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

const Schedule: React.FC<Props> = ({ entries }) => (
  <div>
    {entries.map(entry => (
      <EntryLayout key={`${entry.day}-${entry.time}`} className="has-text-weight-bold">
        <div>{entry.day}</div>
        <div>{entry.time}</div>
      </EntryLayout>
    ))}
  </div>
);

export default Schedule;
