import React from 'react';
import { ScheduleItem } from '../sections/Schedule';
import { PreviewProps } from './cms';

const SchedulePreview: React.FC<PreviewProps> = ({ entry }) => (
  <ScheduleItem title={entry.getIn(['data', 'title'])} time={entry.getIn(['data', 'time'])} />
);

export default SchedulePreview;
