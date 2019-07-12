import CMS from 'netlify-cms-app';
import AgbPagePreview from './AbgPagePreview';
import OfferPreview from './OfferPreview';
import SchedulePreview from './SchedulePreview';
import TestimonialPreview from './TestimonialPreview';

export interface ImmutableJsRecord {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getIn: (path: string[]) => any;
}

export interface PreviewProps {
  entry: ImmutableJsRecord;
  widgetFor: (name: string) => object;
  widgetsFor: (name: string) => ImmutableJsRecord[];
  getAsset: (name: string) => object;
}

CMS.registerPreviewTemplate('agb', AgbPagePreview);
CMS.registerPreviewTemplate('offers', OfferPreview);
CMS.registerPreviewTemplate('schedule', SchedulePreview);
CMS.registerPreviewTemplate('testimonials', TestimonialPreview);
