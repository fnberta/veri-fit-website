import CMS from 'netlify-cms-app';
import AgbPagePreview from './AbgPagePreview';
import OfferPreview from './OfferPreview';
import SchedulePreview from './SchedulePreview';
import TestimonialPreview from './TestimonialPreview';

// @ts-expect-error typings are wrong
CMS.registerPreviewTemplate('agb', AgbPagePreview);
// @ts-expect-error typings are wrong
CMS.registerPreviewTemplate('offers', OfferPreview);
// @ts-expect-error typings are wrong
CMS.registerPreviewTemplate('schedule', SchedulePreview);
// @ts-expect-error typings are wrong
CMS.registerPreviewTemplate('testimonials', TestimonialPreview);
