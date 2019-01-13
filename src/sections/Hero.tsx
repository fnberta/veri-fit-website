import styled from '@emotion/styled';
import Image, { FluidObject } from 'gatsby-image';
import React from 'react';
import { Subtitle } from '../components/bulma/Heading';
import { ChildImageSharp, FluidImage } from '../interfaces';
import { parallax } from '../utils/styles';

export interface Props {
  logo: ChildImageSharp<FluidImage>;
}

const Layout = styled.section(parallax(), {
  position: 'relative',
  backgroundImage: `url(${require('../images/hero.jpg')})`,
});

const Hero: React.FC<Props> = ({ logo }) => (
  <Layout id="home" className="hero is-fullheight">
    <div className="hero-body columns">
      <div className="column is-three-fifths">
        <Image fluid={logo.childImageSharp.fluid} title="Veri-Fit" alt="Veri-Fit" />
        <Subtitle
          className="has-text-light"
          text={
            <>
              Tone your body, calm your mind,
              <br />
              get in shape – feel great!
            </>
          }
          size={3}
        />
      </div>
    </div>
  </Layout>
);

export default Hero;
