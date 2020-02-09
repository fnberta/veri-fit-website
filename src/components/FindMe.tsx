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
        Lagerplatz 6, Winterthur
        <br />
        1. OG – Raum 111
      </BulletItem>
    </div>
    <div className="column">
      <BulletItem icon="fa-at" title="Email">
        <PlainLink href="mailto:vlienhard@gmail.com" target="_blank">
          vlienhard@gmail.com
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
