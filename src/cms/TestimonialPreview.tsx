import React from 'react';
import Testimonial from '../components/Testimonial';
import { PreviewProps } from './cms';

// this doesn't look good because css-in-js is broken with preview pane at the moment
// see https://github.com/netlify/netlify-cms/issues/793#
const TestimonialPreview: React.FC<PreviewProps> = ({ entry }) => (
  <div style={{ backgroundColor: 'black' }}>
    <Testimonial author={entry.getIn(['data', 'author'])} quote={entry.getIn(['data', 'quote'])} />
  </div>
);

export default TestimonialPreview;
