import styled from '@emotion/styled';
import React from 'react';
import { Title } from '../components/bulma/Heading';
import { parallax } from '../utils/styles';

const Section = styled.section(parallax(true), {
  minHeight: '20rem',
  display: 'flex',
  alignItems: 'center',
  backgroundImage: `url(${require('../images/sunrise.jpg')})`,
});

const Current: React.FC = () => (
  <Section className="section">
    <div className="container has-text-centered">
      <Title className="has-text-light" text="Aktuell: Training über die Festtage!" size={3} />
      <div className="content has-text-light">
        <p>Yoga Mi 26.12.18 & Mi 2.01.19 um 12.05-13.00 Uhr</p>
        <p>Yoga Sa 29.12.18 & Sa 5.01.19 um 9.15-10.15 Uhr</p>
        <p>HIIT Mi 26.12.18 10.45-11.30 Uhr</p>
      </div>
    </div>
  </Section>
);

export default Current;
