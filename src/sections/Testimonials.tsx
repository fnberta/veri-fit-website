import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import Dots from '../components/Dots';
import Testimonial, { Props as TestimonialProps } from '../components/Testimonial';
import { parallax, verticallySpaced } from '../utils/styles';

export interface Props {
  testimonialData: TestimonialProps[];
}

const Layout = styled.section(parallax(true), verticallySpaced('1.5rem'), {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '20rem',
  backgroundImage: `url(${require('../images/testimonials.jpg')})`,
});

const Testimonials: React.FC<Props> = ({ testimonialData }) => {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  function handleSlideChange(idx: number) {
    const length = testimonialData.length;
    setActiveSlideIdx(idx < length ? idx : idx - length);
  }

  return (
    <Layout className="section">
      <Carousel value={activeSlideIdx} infinite={true} centered={true} autoPlay={5000} onChange={handleSlideChange}>
        {testimonialData.map((data, idx) => (
          <Testimonial key={`${data.author}-${idx}`} {...data} />
        ))}
      </Carousel>
      <Dots activeIdx={activeSlideIdx} onDotClick={handleSlideChange} count={testimonialData.length} />
    </Layout>
  );
};

export default Testimonials;
