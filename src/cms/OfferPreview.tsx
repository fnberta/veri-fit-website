import React from 'react';
import Offer from '../components/Offer';
import { PreviewProps } from './cms';

const OfferPreview: React.FC<PreviewProps> = ({ entry, widgetFor, widgetsFor, getAsset }) => {
  const prices = widgetsFor('prices').map(price => ({
    price: price.getIn(['data', 'price']),
    type: price.getIn(['data', 'type']),
    validity: price.getIn(['data', 'validity']),
  }));
  const asset = getAsset(entry.getIn(['data', 'image']));
  const image = asset ? <img src={asset.toString()} alt="Training" /> : undefined;
  return (
    <Offer
      title={entry.getIn(['data', 'title'])}
      subtitle={entry.getIn(['data', 'subtitle'])}
      image={image}
      prices={prices}
      body={widgetFor('body')}
    />
  );
};

export default OfferPreview;
