import Image, { FluidObject } from 'gatsby-image';
import React from 'react';
import Offer, { Price } from '../components/Offer';
import { FluidImageFragment } from '../generatedGraphQL';

export interface OfferData {
  order: number;
  title: string;
  subtitle: string;
  image: FluidImageFragment;
  prices: Price[];
  html: string;
}

export interface Props {
  data: OfferData[];
}

const Offers: React.FC<Props> = ({ data }) => (
  <section id="offer" className="bg-gray-100">
    <div className="container mx-auto px-8 py-20">
      <div className="grid lg:grid-cols-3 gap-6 items-center">
        <h1 className="text-6xl font-bold leading-tight">
          <span className="text-orange-500">Training</span>
          <br className="hidden lg:inline" />
          <span className="lg:hidden"> </span>für dich!
        </h1>
        <p className="lg:col-span-2 text-2xl text-gray-700">
          Kraft, Stabilität, Beweglichkeit, Athletik, Elastizität, Ausdauer, Freude, Energie, Entspannung, Gesundheit,
          Haltung, Wohlbefinden – Gerne unterstütze ich dich beim Erreichen deiner Trainingsziele!
        </p>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {data
          .sort((a, b) => a.order - b.order)
          .map((data, idx) => (
            <Offer
              key={`${data.title}-${idx}`}
              title={data.title}
              subtitle={data.subtitle}
              image={<Image fluid={data.image.childImageSharp!.fluid as FluidObject} alt="Training image" />}
              prices={data.prices}
              body={data.html}
            />
          ))}
      </div>
    </div>
  </section>
);

export default Offers;
