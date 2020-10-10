import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { MetadataQuery, SiteSiteMetadata } from '../generatedGraphQL';

export type Meta = JSX.IntrinsicElements['meta'];

export interface Props {
  title: string;
  lang?: string;
  meta?: Meta[];
  keywords?: string[];
}

const DETAILS_QUERY = graphql`
  query Metadata {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;

function getMeta(meta: Meta[], keywords: string[], { title, description }: SiteSiteMetadata): Meta[] {
  const list: Meta[] = [
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
  ];

  if (keywords.length > 0) {
    list.push({
      name: 'keywords',
      content: keywords.join(', '),
    });
  }

  return list.concat(meta);
}

const DocHead: React.FC<Props> = ({ title, lang = 'de-CH', meta = [], keywords = [] }) => {
  const data = useStaticQuery<MetadataQuery>(DETAILS_QUERY);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { siteMetadata } = data.site!;
  return (
    <Helmet titleTemplate={`%s | ${siteMetadata.title}`} meta={getMeta(meta, keywords, siteMetadata)}>
      <html lang={lang} />
      <title>{title}</title>
      <link rel="icon" type="image/png" href={require('../images/favicon-32x32.png')} sizes="32x32" />
      <link rel="icon" type="image/png" href={require('../images/favicon-16x16.png')} sizes="16x16" />
    </Helmet>
  );
};

export default DocHead;
