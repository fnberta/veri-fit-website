import styled from '@emotion/styled';
import React from 'react';
import Heading from '../components/bulma/Heading';
import { parallax } from '../utils/styles';

const Layout = styled.section(parallax(true), {
  minHeight: '20rem',
  display: 'flex',
  alignItems: 'center',
  backgroundImage: `url(${require('../images/warrior.jpg')})`,
});

const TryOut: React.FC = () => (
  <Layout className="section">
    <div className="container has-text-centered">
      <Heading className="has-text-light" text="Starte jetzt gleich mit einem Probetraining!" size={3} />
      <a className="button is-primary is-uppercase" role="button" href="#contact">
        Anmeldung
      </a>
    </div>
  </Layout>
);

export default TryOut;
