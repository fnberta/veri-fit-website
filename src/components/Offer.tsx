import React from 'react';
import Body from './Body';
import { Subtitle, Title } from './bulma/Heading';
import { FullHeightCard } from './Layout';

export interface Price {
  price: number;
  type: number;
  validity?: string;
}

export interface Props {
  title: string;
  subtitle: string;
  image?: React.ReactNode;
  body: string | object;
  prices: Price[];
}

function getPriceTypeDisplay(type: number): string {
  if (type === 1) {
    return 'Einzeleintritt';
  }

  return `${type}er Abo`;
}

const Offer: React.FC<Props> = ({ title, subtitle, image, body, prices }) => (
  <FullHeightCard image={image}>
    <Title text={title} size={4} />
    <Subtitle text={subtitle} size={5} />
    <Body data={body} />
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>Typ</th>
          <th>Preis</th>
        </tr>
      </thead>
      <tbody>
        {prices.map(price => (
          <tr key={`${price.type}-${price.price}`}>
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
);

export default Offer;
