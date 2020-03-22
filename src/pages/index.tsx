import { graphql } from 'gatsby';
import React, { useEffect, useState } from 'react';
import Layout from '../common/components/Layout';
import Navbar from '../common/components/Navbar';
import { IndexPageQuery } from '../generatedGraphQL';
import AboutMe from '../landing/AboutMe';
import ContactMe from '../landing/ContactMe';
import Current from '../landing/Current';
import Hero from '../landing/Hero';
import LocationMap from '../landing/LocationMap';
import Offers, { OfferData } from '../landing/Offers';
import Schedule, { ScheduleEntryData } from '../landing/Schedule';
import TryOut from '../landing/TryOut';

export interface Props {
  data: IndexPageQuery;
}

// lot's of assertions here, would need proper graphql schema customization to fix
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
      <Current />
      <Offers data={data.offers.nodes.map(node => ({ ...node.frontmatter, html: node.html } as OfferData))} />
      <TryOut />
      <Schedule entries={data.schedule.nodes.map(node => node.frontmatter as ScheduleEntryData)} />
      <AboutMe vera={data.vera!} />
      <ContactMe />
      <LocationMap />
    </Layout>
  );
};

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
