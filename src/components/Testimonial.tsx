import React from 'react';

export interface Props {
  author: string;
  quote: string;
}

const Testimonial: React.FC<Props> = ({ author, quote }) => (
  <div className="px-4 flex flex-col items-center justify-center">
    <blockquote className="text-2xl text-white text-center font-serif italic">
      <span className="fas fa-quote-left absolute top-0 left-0 -mt-1 -ml-1 fill-current text-gray-600" />
      <span className="relative">{quote}</span>
      <span className="fas fa-quote-right absolute bottom-0 right-0 -mb-4 -mr-4 fill-current text-gray-600" />
    </blockquote>
    <p className="mt-4 text-white text-base font-semibold">{`– ${author}`}</p>
  </div>
);

export default Testimonial;
