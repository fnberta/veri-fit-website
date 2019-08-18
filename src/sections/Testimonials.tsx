import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import Dots from '../components/Dots';
import Testimonial, { Props as TestimonialProps } from '../components/Testimonial';
import { parallax } from '../utils/styles';

export interface Props {
  data: TestimonialProps[];
}

const Section = styled.section(parallax(true), {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '20rem',
  backgroundImage: `url(${require('../images/testimonials.jpg')})`,
});

const Testimonials: React.FC<Props> = ({ data }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  function handleSlideChange(idx: number) {
    const length = data.length;
    setActiveSlideIdx(idx < length ? idx : idx - length);
  }

  return (
    <Section className="section">
      <Carousel
        className="block"
        value={activeSlideIdx}
        infinite={true}
        centered={true}
        autoPlay={5000}
        onChange={handleSlideChange}
      >
        {data.map((data, idx) => (
          <Testimonial key={`${data.author}-${idx}`} {...data} />
        ))}
      </Carousel>
      <Dots className="block" activeIdx={activeSlideIdx} onDotClick={handleSlideChange} count={data.length} />
    </Section>
  );
};

export default Testimonials;
