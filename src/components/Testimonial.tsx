import React from 'react';

export interface Props {
  author: string;
  quote: string;
}

const Testimonial: React.FC<Props> = ({ author, quote }) => (
  <div className="flex flex-col items-center justify-center">
    <blockquote className="text-2xl text-white text-center font-serif italic">{quote}</blockquote>
    <p className="mt-4 text-white text-base font-semibold">{`– ${author}`}</p>
  </div>
);

export default Testimonial;
