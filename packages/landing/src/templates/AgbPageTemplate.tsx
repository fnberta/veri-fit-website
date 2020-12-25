/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { graphql, PageProps } from 'gatsby';
import React, { FC } from 'react';
import Body from '../Body';
import Layout from '../Layout';
import { AgbPageQuery } from '../generatedGraphQL';

export interface TemplateProps {
  title: string;
  subtitle: string;
  body: string | Record<string, unknown>;
}

export const AgbTemplate: FC<TemplateProps> = ({ title, subtitle, body }) => (
  <Layout title="AGB">
    <section className="max-w-screen-xl mx-auto px-8 py-20">
      <h1 className="text-5xl font-semibold leading-tight">{title}</h1>
      <h2 className="text-3xl text-gray-800 leading-tight">{subtitle}</h2>
      <Body className="mt-6" body={body} />
    </section>
  </Layout>
);

export type Props = PageProps<AgbPageQuery>;

const AgbPageTemplate: FC<Props> = ({ data }) => {
  const { frontmatter, html } = data.markdownRemark!;
  return <AgbTemplate title={frontmatter!.title!} subtitle={frontmatter!.subtitle!} body={html!} />;
};

export default AgbPageTemplate;

export const query = graphql`
  query AgbPage($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        subtitle
      }
    }
  }
`;
