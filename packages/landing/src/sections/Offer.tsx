import React, { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import cx from 'classnames';
import Body from '../Body';

export interface Price {
  price: number;
  type: number;
  validity?: string;
}

export interface Props extends ComponentPropsWithoutRef<'div'> {
  title: string;
  subtitle: string;
  image?: ReactNode;
  body: string | Record<string, unknown>;
  prices: Price[];
}

function getPriceTypeDisplay(type: number): string {
  if (type === 1) {
    return 'Einzeleintritt';
  }

  return `${type}er Abo`;
}

const Offer: FC<Props> = ({ title, subtitle, image, body, prices, className, ...rest }) => (
  <div className={cx('card', className)} {...rest}>
    {image}
    <div className="card-body">
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
    </div>
  </div>
);

export default Offer;
