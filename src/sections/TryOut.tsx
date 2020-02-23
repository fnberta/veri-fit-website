import React from 'react';

const TryOut: React.FC = () => (
  <section
    className="parallax parallax-overlay"
    style={{ backgroundImage: `url(${require('../images/warrior.jpg')})` }}
  >
    <div className="relative h-full container mx-auto px-8 py-20 flex flex-col items-center justify-center">
      <p className="text-3xl text-white text-center">Starte jetzt gleich mit einem Probetraining!</p>
      <a className="block mt-8 btn btn-large btn-orange uppercase tracking-wider" href="/#contact">
        Kontakt
      </a>
    </div>
  </section>
);

export default TryOut;
