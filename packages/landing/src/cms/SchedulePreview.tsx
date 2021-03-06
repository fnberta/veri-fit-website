import React, { FC } from 'react';
import { ScheduleItem } from '../sections/Schedule';
import { PreviewProps } from './interfaces';

const SchedulePreview: FC<PreviewProps> = ({ entry }) => (
  <ScheduleItem title={entry.getIn(['data', 'title']) as string} time={entry.getIn(['data', 'time']) as string} />
);

export default SchedulePreview;
