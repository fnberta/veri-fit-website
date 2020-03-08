import { Link } from 'gatsby';
import React from 'react';

const Footer: React.FC = () => (
  <section className="p-4 flex flex-col items-center justify-center">
    <p className="text-center">
      Copyright 2020 by Vera Lienhard
      <br />
      <span className="mt-2 text-center">
        {'Es gelten die '}
        <Link className="link" to="/agb/">
          allgemeinen Geschäftsbedingungen
        </Link>
        .
      </span>
    </p>
  </section>
);

export default Footer;
