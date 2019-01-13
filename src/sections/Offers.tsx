import { Link } from 'gatsby';
import Image, { FluidObject } from 'gatsby-image';
import React from 'react';
import Heading from '../components/bulma/Heading';
import { FullHeightCard } from '../components/Layout';
import { ChildImageSharp, FluidImage } from '../interfaces';

export interface Price {
  price: number;
  type: number;
  validity?: string;
}

export interface OfferData {
  title: string;
  subtitle: string;
  image: ChildImageSharp<FluidImage>;
  prices: Price[];
  html: string;
}

export interface Props {
  offerData: OfferData[];
}

function getPriceTypeDisplay(type: number): string {
  if (type === 1) {
    return 'Einzeleintritt';
  }

  return `${type}er Abo`;
}

const Offers: React.FC<Props> = ({ offerData }) => (
  <section id="offer" className="section has-background-light">
    <div className="container">
      <Heading className="has-text-centered" text="Training für dich!" size={1} />
      <div className="content has-text-centered">
        <p>
          Kraft, Stabilität, Beweglichkeit, Athletik, Elastizität, Ausdauer, Freude, Energie, Entspannung, Gesundheit,
          Haltung, Wohlbefinden – Gerne unterstütze ich dich beim Erreichen deiner Trainingsziele!
        </p>
        <p className="has-text-weight-bold">
          Finde dein optimales Training – für dein Wohlbefinden – für deinen Erfolg – für dich!
        </p>
      </div>
      <div className="columns">
        {offerData.map(data => (
          <div key={data.title} className="column">
            <FullHeightCard image={<Image fluid={data.image.childImageSharp.fluid} alt="Training image" />}>
              <Heading text={data.title} size={4} />
              <Heading text={data.subtitle} size={5} type="subtitle" />
              <div className="content">
                <div dangerouslySetInnerHTML={{ __html: data.html }} />
              </div>
              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    <th>Typ</th>
                    <th>Preis</th>
                  </tr>
                </thead>
                <tbody>
                  {data.prices.map(price => (
                    <tr>
                      <td>
                        <div>{getPriceTypeDisplay(price.type)}</div>
                        {price.validity && <div className="is-size-7">{`(gültig für ${price.validity})`}</div>}
                      </td>
                      <td>
                        <span className="is-size-6">CHF </span>
                        <span className="is-size-4">{price.price}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </FullHeightCard>
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
