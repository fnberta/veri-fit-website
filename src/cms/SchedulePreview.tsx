import React from 'react';
import { ScheduleItem } from '../landing/Schedule';
import { PreviewProps } from './interfaces';

const SchedulePreview: React.FC<PreviewProps> = ({ entry }) => (
  <ScheduleItem title={entry.getIn(['data', 'title'])} time={entry.getIn(['data', 'time'])} />
);

export default SchedulePreview;
