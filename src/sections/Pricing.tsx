import { Link } from 'gatsby';
import Image, { FluidObject } from 'gatsby-image';
import React from 'react';
import Heading from '../components/bulma/Heading';
import { FullHeightCard } from '../components/Layout';
import { ChildImageSharp, FluidImage } from '../interfaces';

export interface PriceData {
  title: string;
  subtitle: string;
  price: number;
  image: ChildImageSharp<FluidImage>;
}

export interface Props {
  priceData: PriceData[];
}

const Pricing: React.FC<Props> = ({ priceData }) => (
  <section id="pricing" className="section has-background-light">
    <div className="container has-text-centered">
      <Heading text="Preise" size={1} />
      <Heading text="Für jede und jeden das optimale Package" size={3} type="subtitle" />
      <div className="columns">
        {priceData.map(data => (
          <div key={`${data.title}-${data.price}`} className="column">
            <FullHeightCard image={<Image fluid={data.image.childImageSharp.fluid} />}>
              <Heading text={data.title} size={4} />
              <Heading text={data.subtitle} size={5} type="subtitle" />
              <div>
                <span className="title is-5">CHF </span>
                <span className="title is-1">{data.price}</span>
              </div>
            </FullHeightCard>
          </div>
        ))}
      </div>
      <div className="content">
        <p>
          Es gelten die <Link to="/agb/">allgemeinen Geschäftsbedingungen</Link>
        </p>
      </div>
    </div>
  </section>
);

export default Pricing;
