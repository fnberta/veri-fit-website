import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import cx from 'classnames';
import React, { useState } from 'react';
import Testimonial, { Props as TestimonialProps } from '../components/Testimonial';
import { range } from '../utils/numbers';

export interface Props {
  data: TestimonialProps[];
}

const Testimonials: React.FC<Props> = ({ data }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  function handleSlideChange(idx: number) {
    const length = data.length;
    setActiveSlideIdx(idx < length ? idx : idx - length);
  }

  return (
    <section
      className="flex items-center justify-center parallax parallax-overlay"
      style={{ backgroundImage: `url(${require('../images/testimonials.jpg')})` }}
    >
      <div className="container mx-auto px-8 py-20">
        <Carousel value={activeSlideIdx} infinite={true} centered={true} autoPlay={5000} onChange={handleSlideChange}>
          {data.map((data, idx) => (
            <Testimonial key={`${data.author}-${idx}`} {...data} />
          ))}
        </Carousel>
        <div className="relative mt-8 flex items-center justify-center">
          {range(0, data.length).map(idx => (
            <button
              key={idx}
              className="btn w-6 h-6 flex items-center justify-center cursor-pointer"
              onClick={() => handleSlideChange(idx)}
            >
              <span
                className={cx(
                  'block bg-white rounded-full transition-all duration-200',
                  activeSlideIdx === idx ? 'w-3 h-3' : 'w-2 h-2',
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
