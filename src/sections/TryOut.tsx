import styled from '@emotion/styled';
import React from 'react';
import { Container, Section } from '../components/bulma/Page';
import { Title } from '../components/bulma/Heading';
import { parallax } from '../utils/styles';

const ParallaxSection = styled(Section)(parallax(true), {
  minHeight: '20rem',
  display: 'flex',
  alignItems: 'center',
  backgroundImage: `url(${require('../images/warrior.jpg')})`,
});

const TryOut: React.FC = () => (
  <ParallaxSection>
    <Container className="has-text-centered">
      <Title className="has-text-light" text="Starte jetzt gleich mit einem Probetraining!" size={3} />
      <a className="button is-primary is-uppercase" role="button" href="#contact">
        Kontakt
      </a>
    </Container>
  </ParallaxSection>
);

export default TryOut;
