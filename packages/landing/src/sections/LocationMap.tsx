import React, { FC } from 'react';

const LocationMap: FC = () => (
  <section style={{ height: '400px' }}>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6322.961483916522!2d8.720848933510352!3d47.497922107394075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479a9973b8957f2f%3A0xb4e1a93adfcddfcd!2sLagerpl.%206%2C%208400%20Winterthur!5e0!3m2!1sde!2sch!4v1572641793515!5m2!1sde!2sch"
      width="100%"
      height="100%"
      title="Location Map"
      allowFullScreen={true}
    />
  </section>
);

export default LocationMap;
