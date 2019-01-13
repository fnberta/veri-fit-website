import styled from '@emotion/styled';
import React from 'react';
import { verticallySpaced } from '../utils/styles';
import { Title } from './bulma/Heading';

export interface Props {
  author: string;
  quote: string;
}

const Layout = styled.div(verticallySpaced('1.5rem'), {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '720px',
  alignItems: 'center',
  justifyContent: 'center',
});

const Quote = styled.blockquote({
  display: 'block',
  fontFamily: 'serif',
});

const Testimonial: React.FC<Props> = ({ author, quote }) => (
  <Layout>
    <Quote className="has-text-light is-italic is-size-4 has-text-weight-light has-text-centered">{quote}</Quote>
    <Title className="has-text-light" size={6} text={`– ${author}`} />
  </Layout>
);

export default Testimonial;
