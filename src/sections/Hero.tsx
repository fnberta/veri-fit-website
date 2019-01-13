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

const ImageTitle = styled.div({
  width: '100%',
  '@media screen and (min-width: 321px)': {
    width: '80%',
  },
  '@media screen and (min-width: 641px)': {
    width: '60%',
  },
  '@media screen and (min-width: 769px)': {
    width: '50%',
  },
  '@media screen and (min-width: 1216px)': {
    width: '40%',
  },
});

const Hero: React.FC<Props> = ({ logo }) => (
  <Layout id="home" className="hero is-fullheight">
    <div className="hero-body">
      <ImageTitle>
        <Image fluid={logo.childImageSharp.fluid} title="Veri-Fit" alt="Veri-Fit" />
        <Subtitle
          className="has-text-light is-size-4-touch"
          size={3}
          text={
            <>
              Tone your body, calm your mind,
              <br />
              get in shape – feel great!
            </>
          }
        />
      </ImageTitle>
    </div>
  </Layout>
);

export default Hero;
