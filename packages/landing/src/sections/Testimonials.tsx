// @ts-expect-error not used currently
import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import cx from 'classnames';
import React, { FC, useState } from 'react';
import Testimonial, { Props as TestimonialProps } from './Testimonial';

export interface Props {
  data: TestimonialProps[];
}

function range(start: number, length: number): number[] {
  const result = [];
  for (let i = start; i < length; i++) {
    result.push(i);
  }

  return result;
}

const Testimonials: FC<Props> = ({ data }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  function handleSlideChange(idx: number) {
    const length = data.length;
    setActiveSlideIdx(idx < length ? idx : idx - length);
  }

  return (
    <section
      className="parallax parallax-overlay"
      style={{ backgroundImage: `url(${require('../images/testimonials.jpg')})` }}
    >
      <header>
        <h1 className="sr-only">Testimonials</h1>
      </header>
      <div className="max-w-5xl mx-auto px-8 py-20">
        <Carousel value={activeSlideIdx} infinite={true} centered={true} autoPlay={5000} onChange={handleSlideChange}>
          {data.map((data, idx) => (
            <Testimonial key={`${data.author}-${idx}`} {...data} />
          ))}
        </Carousel>
        <div className="relative -ml-2 mt-8 flex items-center justify-center">
          {range(0, data.length).map((idx) => (
            <button
              key={idx}
              className="w-4 h-4 ml-2 flex items-center justify-center cursor-pointer outline-none focus:shadow-outline"
              onClick={() => handleSlideChange(idx)}
            >
              <span
                className={cx(
                  'block bg-white rounded-full transition-all duration-200',
                  activeSlideIdx === idx ? 'w-4 h-4' : 'w-2 h-2',
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
