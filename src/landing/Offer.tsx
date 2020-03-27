import React from 'react';
import Body from '../common/components/Body';
import Card from '../common/components/Card';

export interface Price {
  price: number;
  type: number;
  validity?: string;
}

export interface Props extends React.HTMLProps<HTMLDivElement> {
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

const Offer: React.FC<Props> = ({ title, subtitle, image, body, prices, className, ...rest }) => (
  <Card className={className} image={image} {...rest}>
    <h2 className="text-2xl font-semibold leading-tight">{title}</h2>
    <h3 className="text-xl text-gray-800 leading-tight">{subtitle}</h3>
    <Body className="mt-4" body={body} />
    <table className="mt-4 table w-full">
      <thead>
        <tr>
          <th>Typ</th>
          <th>Preis</th>
        </tr>
      </thead>
      <tbody>
        {prices.map((price) => (
          <tr key={`${price.type}-${price.price}`}>
            <td>
              <div>{getPriceTypeDisplay(price.type)}</div>
              {price.validity && <div className="text-xs">{`(gültig für ${price.validity})`}</div>}
            </td>
            <td>
              <span className="text-gray-700 uppercase tracking-wider">chf </span>
              <span className="text-2xl">{price.price.toLocaleString()}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

export default Offer;
