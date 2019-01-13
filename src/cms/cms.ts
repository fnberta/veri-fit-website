import CMS from 'netlify-cms';
import AgbPagePreview from './AbgPagePreview';
import OfferPreview from './OfferPreview';

interface ImmutableJsRecords {
  // tslint:disable-next-line:no-any
  getIn: (path: string[]) => any;
}

export interface PreviewProps {
  entry: ImmutableJsRecords;
  widgetFor: (name: string) => object;
  widgetsFor: (name: string) => ImmutableJsRecords[];
  getAsset: (name: string) => object;
}

CMS.registerPreviewTemplate('agb', AgbPagePreview);
CMS.registerPreviewTemplate('offers', OfferPreview);
