import React, { FC } from 'react';
import { AnchorButton } from '@veri-fit/common-ui';

const TryOut: FC = () => (
  <section
    className="parallax parallax-overlay"
    style={{ backgroundImage: `url(${require('../images/warrior.jpg')})` }}
  >
    <div className="relative max-w-screen-xl mx-auto px-8 py-20">
      <div className="-mt-12 -ml-12 flex flex-wrap items-center">
        <div className="w-3/5 flex-auto mt-12 ml-12">
          <p className="text-4xl leading-snug font-semibold">
            <span className="text-white">Let's do this!</span>
            <br />
            <span className="text-orange-500">Starte heute mit einem Probetraining.</span>
          </p>
          <p className="mt-4 text-white text-2xl leading-tight">
            Für dein Wohlbefinden – für deinen Erfolg – für dich!
          </p>
        </div>
        <AnchorButton className="mt-12 ml-12 uppercase tracking-wider" colorScheme="orange" size="xl" href="/#contact">
          Kontakt
        </AnchorButton>
      </div>
    </div>
  </section>
);

export default TryOut;
