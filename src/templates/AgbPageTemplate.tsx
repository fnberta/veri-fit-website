import { graphql } from 'gatsby';
import React from 'react';
import Heading from '../components/bulma/Heading';
import Layout from '../components/Layout';

export interface Props {
  data: {
    markdownRemark: {
      html: string;
      frontmatter: {
        title: string;
        subtitle: string;
      };
    };
  };
}

const AgbReactTemplate: React.FC<Props> = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark;
  return (
    <Layout title="AGB">
      <section className="section">
        <div className="container">
          <Heading text={frontmatter.title} size={1} />
          <Heading text={frontmatter.subtitle} size={3} type="subtitle" />
          <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </section>
    </Layout>
  );
};

export default AgbReactTemplate;

export const query = graphql`
  query AgbPageQuery($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        subtitle
      }
    }
  }
`;
