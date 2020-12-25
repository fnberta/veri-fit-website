// lot's of assertions here, would need proper graphql schema customization to fix
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { graphql, Link, PageProps } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import React, { FC } from 'react';
import Navbar from '../Navbar';
import Layout from '../Layout';
import { IndexPageQuery } from '../generatedGraphQL';
import AboutMe from '../sections/AboutMe';
import ContactMe from '../sections/ContactMe';
import Hero from '../sections/Hero';
import LocationMap from '../sections/LocationMap';
import Offers, { OfferData } from '../sections/Offers';
import Schedule, { ScheduleEntryData } from '../sections/Schedule';
import TryOut from '../sections/TryOut';

export type Props = PageProps<IndexPageQuery>;

const IndexPage: FC<Props> = ({ data }) => (
  <Layout title="Home">
    <Navbar>
      <Link to="/#home">Home</Link>
      <Link to="/#offer">Angebot</Link>
      <Link to="/#schedule">Stundenplan</Link>
      <Link to="/#about">Über mich</Link>
      <Link to="/#contact">Kontakt</Link>
    </Navbar>
    <Hero />
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
    offers: allMarkdownRemark(filter: { fields: { collection: { eq: "offers" } } }) {
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
    schedule: allMarkdownRemark(filter: { fields: { collection: { eq: "schedule" } } }) {
      nodes {
        frontmatter {
          title
          weekday
          timeOfDay
          time
        }
      }
    }
  }
`;
