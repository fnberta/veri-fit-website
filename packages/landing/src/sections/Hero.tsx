import React, { FC } from 'react';

const Hero: FC = () => (
  <section
    id="home"
    className="h-screen parallax parallax-overlay flex items-center"
    style={{ backgroundImage: `url(${require('../images/hero.jpg')})` }}
  >
    <header className="relative p-12 md:px-24 lg:px-32">
      <h1 className="sr-only">Veri-Fit</h1>
      <p className="text-4xl lg:text-5xl text-white leading-tight">
        Tone your body,
        <br />
        calm your mind,
        <br />
        get in shape <br />
        <span className="text-orange-500 font-semibold">– feel great!</span>
      </p>
    </header>
  </section>
);

export default Hero;
