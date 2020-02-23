import { graphql } from 'gatsby';
import React from 'react';
import Body from '../components/Body';
import Layout from '../components/Layout';
import { AgbPageQuery } from '../generatedGraphQL';

export interface Props {
  data: AgbPageQuery;
}

export interface TemplateProps {
  title: string;
  subtitle: string;
  body: string | object;
}

export const AgbTemplate: React.FC<TemplateProps> = ({ title, subtitle, body }) => (
  <Layout title="AGB">
    <section className="container mx-auto px-8 py-12">
      <h1 className="section-header">{title}</h1>
      <h2 className="text-3xl text-gray-800 leading-tight">{subtitle}</h2>
      <Body className="mt-6" body={body} />
    </section>
  </Layout>
);

const AgbPageTemplate: React.FC<Props> = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark!;
  return <AgbTemplate title={frontmatter!.title!} subtitle={frontmatter!.subtitle!} body={html!} />;
};

export default AgbPageTemplate;

export const query = graphql`
  query AgbPage($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        title
        subtitle
      }
    }
  }
`;
