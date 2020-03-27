// lot's of assertions here, would need proper graphql schema customization to fix
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import React, { useEffect, useState } from 'react';
import Layout from '../common/components/Layout';
import Navbar from '../common/components/Navbar';
import { IndexPageQuery } from '../generatedGraphQL';
import AboutMe from '../landing/AboutMe';
import ContactMe from '../landing/ContactMe';
import Current, { Video } from '../landing/Current';
import Hero from '../landing/Hero';
import LocationMap from '../landing/LocationMap';
import Offers, { OfferData } from '../landing/Offers';
import Schedule, { ScheduleEntryData } from '../landing/Schedule';
import TryOut from '../landing/TryOut';

export interface Props {
  data: IndexPageQuery;
}

const IndexPage: React.FC<Props> = ({ data }) => {
  const [navFixed, setNavFixed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const el = window.document.getElementById('home');
      if (el) {
        const { bottom } = el.getBoundingClientRect();
        setNavFixed(bottom <= 0);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout title="Home">
      <Navbar variant={navFixed ? 'bright' : 'transparent'} sticky={navFixed}>
        <a href="/#home">Home</a>
        <a href="/#offer">Angebot</a>
        <a href="/#schedule">Stundenplan</a>
        <a href="/#about">Über mich</a>
        <a href="/#contact">Kontakt</a>
      </Navbar>
      <Hero />
      <Current videos={data.videos.nodes.map((node) => node.frontmatter as Video)} />
      <Offers
        data={data.offers.nodes.map(
          (node) =>
            ({
              ...node.frontmatter,
              image: node.frontmatter!.image!.childImageSharp!.fluid as FluidObject,
              html: node.html,
            } as OfferData),
        )}
      />
      <TryOut />
      <Schedule entries={data.schedule.nodes.map((node) => node.frontmatter as ScheduleEntryData)} />
      <AboutMe vera={data.vera!.childImageSharp!.fluid as FluidObject} />
      <ContactMe />
      <LocationMap />
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query IndexPage {
    vera: file(relativePath: { eq: "vera.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    offers: allMarkdownRemark(filter: { frontmatter: { collection: { eq: "offer" } } }) {
      nodes {
        html
        frontmatter {
          order
          title
          subtitle
          image {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
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
    videos: allMarkdownRemark(
      filter: { frontmatter: { collection: { eq: "video" } } }
      sort: { fields: [frontmatter___title], order: ASC }
    ) {
      nodes {
        frontmatter {
          title
          description
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
