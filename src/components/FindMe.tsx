import styled from '@emotion/styled';
import React from 'react';
import BulletItem from './BulletItem';

const PlainLink = styled.a({
  color: 'inherit',
  '&:hover': {
    color: 'inherit',
  },
});

const FindMe: React.FC = () => (
  <div className="columns">
    <div className="column">
      <BulletItem icon="fa-location-arrow" title="Location">
        Stadthausstrasse 24
        <br />
        beim Bahnhof Winterthur
      </BulletItem>
    </div>
    <div className="column">
      <BulletItem icon="fa-at" title="Email">
        <PlainLink href="mailto:info@veri-fit.ch" target="_blank">
          info@veri-fit.ch
        </PlainLink>
      </BulletItem>
    </div>
    <div className="column">
      <BulletItem icon="fa-phone" title="Telefon">
        +41 79 395 20 33
      </BulletItem>
    </div>
  </div>
);

export default FindMe;
