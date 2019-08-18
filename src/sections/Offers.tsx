import { Link } from 'gatsby';
import Image, { FluidObject } from 'gatsby-image';
import React from 'react';
import { Title } from '../components/bulma/Heading';
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
  <section id="offer" className="section has-background-light">
    <div className="container">
      <Title className="has-text-centered" text="Training für dich!" size={1} />
      <div className="content has-text-centered">
        <p>
          Kraft, Stabilität, Beweglichkeit, Athletik, Elastizität, Ausdauer, Freude, Energie, Entspannung, Gesundheit,
          Haltung, Wohlbefinden – Gerne unterstütze ich dich beim Erreichen deiner Trainingsziele!
        </p>
        <p className="has-text-weight-bold">
          Finde dein optimales Training – für dein Wohlbefinden – für deinen Erfolg – für dich!
        </p>
      </div>
      <div className="columns is-multiline">
        {data
          .sort((a, b) => a.order - b.order)
          .map((data, idx) => (
            <div key={`${data.title}-${idx}`} className="column is-6">
              <Offer
                title={data.title}
                subtitle={data.subtitle}
                image={<Image fluid={data.image!.childImageSharp!.fluid as FluidObject} alt="Training image" />}
                prices={data.prices}
                body={data.html}
              />
            </div>
          ))}
      </div>
      <div className="content has-text-centered">
        <p>
          Es gelten die <Link to="/agb/">allgemeinen Geschäftsbedingungen</Link>
        </p>
      </div>
    </div>
  </section>
);

export default Offers;
