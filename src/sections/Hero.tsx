import Image, { FluidObject } from 'gatsby-image';
import React from 'react';
import { FluidImageNoBase64Fragment } from '../generatedGraphQL';

export interface Props {
  logo: FluidImageNoBase64Fragment;
}

const Hero: React.FC<Props> = ({ logo }) => (
  <section
    id="home"
    className="h-screen pt-16 parallax flex"
    style={{ backgroundImage: `url(${require('../images/hero.jpg')})` }}
  >
    <div className="px-12 py-6 w-full sm:w-3/5">
      <Image fluid={logo.childImageSharp!.fluid as FluidObject} alt="Veri-Fit" />
      <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white leading-tight">
        Tone your body, calm your mind,
        <br />
        get in shape – <span className="text-orange-500 font-semibold">feel great!</span>
      </p>
    </div>
  </section>
);

export default Hero;
