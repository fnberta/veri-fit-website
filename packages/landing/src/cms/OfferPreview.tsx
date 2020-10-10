import React from 'react';
import Offer from '../landing/Offer';
import { PreviewProps } from './interfaces';

const OfferPreview: React.FC<PreviewProps> = ({ entry, widgetFor, widgetsFor, getAsset }) => {
  const prices = widgetsFor('prices').map((price) => ({
    price: price.getIn(['data', 'price']) as number,
    type: price.getIn(['data', 'type']) as number,
    validity: price.getIn(['data', 'validity']) as string,
  }));
  const asset = getAsset(entry.getIn(['data', 'image']) as string);
  const image = asset ? <img src={asset.toString()} alt="Training" /> : undefined;
  return (
    <Offer
      title={entry.getIn(['data', 'title']) as string}
      subtitle={entry.getIn(['data', 'subtitle']) as string}
      image={image}
      prices={prices}
      body={widgetFor('body')}
    />
  );
};

export default OfferPreview;
