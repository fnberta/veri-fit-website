import React from 'react';
import { AnchorButton } from '../components/Button';

const TryOut: React.FC = () => (
  <section
    className="parallax parallax-overlay"
    style={{ backgroundImage: `url(${require('../images/warrior.jpg')})` }}
  >
    <div className="relative h-full container mx-auto px-8 py-20 grid lg:grid-cols-4 gap-12 items-center font-bold">
      <div className="lg:col-span-3 font-bold">
        <p className="text-4xl leading-tight">
          <span className="text-white">Let's do this!</span>
          <br />
          <span className="text-orange-500">Starte heute mit einem Probetraining.</span>
        </p>
        <p className="mt-2 text-white text-2xl leading-tight">Für dein Wohlbefinden – für deinen Erfolg – für dich!</p>
      </div>
      <AnchorButton
        className="uppercase tracking-wider"
        style={{ justifySelf: 'start' }}
        color="orange"
        size="huge"
        href="/#contact"
      >
        Kontakt
      </AnchorButton>
    </div>
  </section>
);

export default TryOut;
