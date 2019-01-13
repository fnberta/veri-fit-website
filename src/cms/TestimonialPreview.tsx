import React from 'react';
import Testimonial from '../components/Testimonial';
import { PreviewProps } from './cms';

const TestimonialPreview: React.FC<PreviewProps> = ({ entry }) => (
  <Testimonial author={entry.getIn(['data', 'author'])} quote={entry.getIn(['data', 'quote'])} />
);

export default TestimonialPreview;
