import styled from '@emotion/styled';
import React from 'react';

const IFrame = styled.iframe({
  height: '450px',
  border: 0,
});

const LocationMap: React.FC = () => (
  <section className="section is-paddingless">
    <IFrame
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2695.490206617615!2d8.722059115599032!3d47.49984380333973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479a997774549033%3A0x237a9866e8a0e98!2sStadthausstrasse+24%2C+8400+Winterthur!5e0!3m2!1sde!2sch!4v1546035117242"
      title="Location Map"
      width="100%"
      height="100%"
      allowFullScreen={true}
    />
  </section>
);

export default LocationMap;
