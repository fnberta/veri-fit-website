import { graphql } from 'gatsby';
import { FixedObject, FluidObject } from 'gatsby-image';
import React from 'react';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import { Price } from '../components/Offer';
import { ChildImageSharp, EdgesNode, FluidImage } from '../interfaces';
import AboutMe from '../sections/AboutMe';
import ContactMe from '../sections/ContactMe';
import Hero from '../sections/Hero';
import LocationMap from '../sections/LocationMap';
import Offers from '../sections/Offers';
import Schedule, { TimeOfDay, Weekday } from '../sections/Schedule';
import Testimonials from '../sections/Testimonials';
import TryOut from '../sections/TryOut';

export interface Props {
  data: {
    logo: ChildImageSharp<FluidImage>;
    vera: ChildImageSharp<FluidImage>;
    offers: EdgesNode<{
      html: string;
      frontmatter: {
        title: string;
        subtitle: string;
        image: ChildImageSharp<FluidImage>;
        prices: Price[];
      };
    }>;
    schedule: EdgesNode<{
      frontmatter: {
        title: string;
        weekday: Weekday;
        timeOfDay: TimeOfDay;
        time: string;
      };
    }>;
    testimonials: EdgesNode<{
      frontmatter: {
        author: string;
        quote: string;
      };
    }>;
  };
}

const IndexPage: React.FC<Props> = ({ data }) => (
  <Layout title="Home">
    <Navbar />
    <Hero logo={data.logo} />
    <Offers
      offerData={data.offers.edges.map(edge => ({
        ...edge.node.frontmatter,
        html: edge.node.html,
      }))}
    />
    <TryOut />
    <Schedule entries={data.schedule.edges.map(edge => edge.node.frontmatter)} />
    <Testimonials testimonialData={data.testimonials.edges.map(edge => edge.node.frontmatter)} />
    <AboutMe vera={data.vera} />
    <ContactMe />
    <LocationMap />
  </Layout>
);

export default IndexPage;

export const query = graphql`
  fragment FluidImage on File {
    childImageSharp {
      fluid {
        ...GatsbyImageSharpFluid
      }
    }
  }

  query IndexPageQuery {
    logo: file(relativePath: { eq: "logo_orange.png" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_noBase64
        }
      }
    }
    vera: file(relativePath: { eq: "vera.jpg" }) {
      ...FluidImage
    }
    offers: allMarkdownRemark(filter: { frontmatter: { collection: { eq: "offer" } } }) {
      edges {
        node {
          html
          frontmatter {
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
    }
    schedule: allMarkdownRemark(filter: { frontmatter: { collection: { eq: "schedule" } } }) {
      edges {
        node {
          frontmatter {
            title
            weekday
            timeOfDay
            time
          }
        }
      }
    }
    testimonials: allMarkdownRemark(filter: { frontmatter: { collection: { eq: "testimonial" } } }) {
      edges {
        node {
          frontmatter {
            author
            quote
          }
        }
      }
    }
  }
`;
