import React from 'react';
import ScheduleItem from '../components/ScheduleItem';
import { PreviewProps } from './cms';

const SchedulePreview: React.FC<PreviewProps> = ({ entry }) => (
  <ScheduleItem
    title={entry.getIn(['data', 'title'])}
    weekday={entry.getIn(['data', 'weekday'])}
    timeOfDay={entry.getIn(['data', 'timeOfDay'])}
    time={entry.getIn(['data', 'time'])}
  />
);

export default SchedulePreview;
