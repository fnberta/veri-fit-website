import Image, { FluidObject } from 'gatsby-image';
import React, { FC } from 'react';
import Offer, { Price } from './Offer';

export interface OfferData {
  order: number;
  title: string;
  subtitle: string;
  image: FluidObject;
  prices: Price[];
  html: string;
}

export interface Props {
  data: OfferData[];
}

const Offers: FC<Props> = ({ data }) => (
  <section id="offer" className="bg-gray-100">
    <div className="max-w-screen-xl mx-auto px-8 py-20">
      <header className="-mt-6 -ml-16 flex flex-wrap items-center">
        <h1 className="mt-6 ml-16 text-5xl font-bold leading-tight">
          <span className="text-orange-500">Training</span> für dich!
        </h1>
        <p className="w-1/2 mt-6 ml-16 flex-auto text-xl text-gray-700">
          Kraft, Stabilität, Beweglichkeit, Athletik, Elastizität, Ausdauer, Freude, Energie, Entspannung, Gesundheit,
          Haltung, Wohlbefinden – Gerne unterstütze ich dich beim Erreichen deiner Trainingsziele!
        </p>
      </header>
      <div className="mt-8 offer-grid">
        {data
          .sort((a, b) => a.order - b.order)
          .map((data, idx) => (
            <Offer
              key={`${data.title}-${idx}`}
              title={data.title}
              subtitle={data.subtitle}
              image={<Image fluid={data.image} alt="Training image" />}
              prices={data.prices}
              body={data.html}
            />
          ))}
      </div>
    </div>
  </section>
);

export default Offers;
