import React from 'react';

const Current: React.FC = () => (
  <section
    className="px-8 py-12 parallax parallax-overlay flex items-center"
    style={{ minHeight: '20rem', backgroundImage: `url(${require('../images/sunrise.jpg')})` }}
  >
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-5xl font-semibold leading-tight text-white">Aktuell: Training über die Festtage!</h1>
      <div className="text-white">
        <p>Yoga Mi 26.12.18 & Mi 2.01.19 um 12.05-13.00 Uhr</p>
        <p>Yoga Sa 29.12.18 & Sa 5.01.19 um 9.15-10.15 Uhr</p>
        <p>HIIT Mi 26.12.18 10.45-11.30 Uhr</p>
      </div>
    </div>
  </section>
);

export default Current;
