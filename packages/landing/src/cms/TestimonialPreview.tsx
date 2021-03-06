import React, { FC } from 'react';
import Testimonial from '../sections/Testimonial';
import { PreviewProps } from './interfaces';

const TestimonialPreview: FC<PreviewProps> = ({ entry }) => (
  <div className="bg-gray-800">
    <Testimonial author={entry.getIn(['data', 'author']) as string} quote={entry.getIn(['data', 'quote']) as string} />
  </div>
);

export default TestimonialPreview;
