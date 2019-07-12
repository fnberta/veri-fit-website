import { graphql } from 'gatsby';
import React from 'react';
import Body from '../components/Body';
import { Subtitle, Title } from '../components/bulma/Heading';
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
    <section className="section">
      <div className="container">
        <Title text={title} size={1} />
        <Subtitle text={subtitle} size={3} />
        <Body data={body} />
      </div>
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
