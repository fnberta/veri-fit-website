import styled from '@emotion/styled';
import React from 'react';
import { ScheduleEntryData } from '../sections/Schedule';
import Card from './bulma/Card';
import { Title } from './bulma/Heading';

export type Props = ScheduleEntryData;

const ItemCard = styled(Card)<Pick<Props, 'weekday' | 'timeOfDay'>>(({ weekday, timeOfDay }) => ({
  '@media screen and (min-width: 769px)': {
    gridColumnStart: weekday,
    gridRowStart: timeOfDay,
  },
}));

const ScheduleItem: React.FC<Props> = ({ title, weekday, timeOfDay, time }) => (
  <ItemCard className="has-text-centered" weekday={weekday} timeOfDay={timeOfDay}>
    <Title text={title} size={5} />
    <p className="is-6">{time}</p>
  </ItemCard>
);

export default ScheduleItem;
