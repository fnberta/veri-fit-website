import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import styled from '@emotion/styled';
import React from 'react';
import Dots from '../components/Dots';
import Testimonial, { Props as TestimonialProps } from '../components/Testimonial';
import { parallax, verticallySpaced } from '../utils/styles';

export interface Props {
  testimonialData: TestimonialProps[];
}

export interface State {
  activeSlideIdx: number;
}

const Layout = styled.section(parallax(true), verticallySpaced('1.5rem'), {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '20rem',
  backgroundImage: `url(${require('../images/testimonials.jpg')})`,
});

class Testimonials extends React.Component<Props, State> {
  readonly state: State = { activeSlideIdx: 0 };

  render() {
    const { activeSlideIdx } = this.state;
    return (
      <Layout className="section">
        <Carousel
          value={activeSlideIdx}
          infinite={true}
          centered={true}
          autoPlay={5000}
          onChange={this.handleSlideChange}
        >
          {this.props.testimonialData.map((data, idx) => (
            <Testimonial key={`${data.author}-${idx}`} {...data} />
          ))}
        </Carousel>
        <Dots activeIdx={activeSlideIdx} onDotClick={this.handleSlideChange} count={3} />
      </Layout>
    );
  }

  private handleSlideChange = (idx: number) => this.setState({ activeSlideIdx: idx });
}

export default Testimonials;
