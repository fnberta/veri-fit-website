import { graphql } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { IndexPageQuery } from '../generatedGraphQL';
import AboutMe from '../sections/AboutMe';
import ContactMe from '../sections/ContactMe';
import Hero from '../sections/Hero';
import LocationMap from '../sections/LocationMap';
import Offers, { OfferData } from '../sections/Offers';
import Schedule, { ScheduleEntryData } from '../sections/Schedule';
import Testimonials from '../sections/Testimonials';
import { Props as TestimonialProps } from '../components/Testimonial';
import TryOut from '../sections/TryOut';

export interface Props {
  data: IndexPageQuery;
}

// lot's of assertions here, would need proper graphql schema customization to fix
const IndexPage: React.FC<Props> = ({ data }) => (
  <Layout title="Home">
    <Navbar />
    <Hero logo={data.logo!} />
    <Offers data={data.offers.nodes.map(node => ({ ...node.frontmatter, html: node.html } as OfferData))} />
    <TryOut />
    <Schedule entries={data.schedule.nodes.map(node => node.frontmatter as ScheduleEntryData)} />
    <Testimonials data={data.testimonials.nodes.map(node => node.frontmatter as TestimonialProps)} />
    <AboutMe vera={data.vera!} />
    <ContactMe />
    <LocationMap />
  </Layout>
);

export default IndexPage;

export const query = graphql`
  fragment FluidImageNoBase64 on File {
    childImageSharp {
      fluid {
        ...GatsbyImageSharpFluid_noBase64
      }
    }
  }

  fragment FluidImage on File {
    childImageSharp {
      fluid {
        ...GatsbyImageSharpFluid
      }
    }
  }

  query IndexPage {
    logo: file(relativePath: { eq: "logo_orange.png" }) {
      ...FluidImageNoBase64
    }
    vera: file(relativePath: { eq: "vera.jpg" }) {
      ...FluidImage
    }
    offers: allMarkdownRemark(filter: { frontmatter: { collection: { eq: "offer" } } }) {
      nodes {
        html
        frontmatter {
          order
          title
          subtitle
          image {
            ...FluidImage
          }
          prices {
            price
            type
            validity
          }
        }
      }
    }
    schedule: allMarkdownRemark(filter: { frontmatter: { collection: { eq: "schedule" } } }) {
      nodes {
        frontmatter {
          title
          weekday
          timeOfDay
          time
        }
      }
    }
    testimonials: allMarkdownRemark(filter: { frontmatter: { collection: { eq: "testimonial" } } }) {
      nodes {
        frontmatter {
          author
          quote
        }
      }
    }
  }
`;
