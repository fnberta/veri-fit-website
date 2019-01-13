import { graphql } from 'gatsby';
import React from 'react';
import Body from '../components/Body';
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

export interface TemplateProps {
  title: string;
  subtitle: string;
  body: string | object
}

export const AgbTemplate: React.FC<TemplateProps> = ({ title, subtitle, body }) =>
  (
    <Layout title="AGB">
      <section className="section">
        <div className="container">
          <Heading text={title} size={1} />
          <Heading text={subtitle} size={3} type="subtitle" />
          <Body data={body} />
        </div>
      </section>
    </Layout>
  );

const AgbPageTemplate: React.FC<Props> = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark;
  return <AgbTemplate title={frontmatter.title} subtitle={frontmatter.subtitle} body={html} />;
};

export default AgbPageTemplate;

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
