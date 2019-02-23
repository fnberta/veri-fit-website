import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';

export type Meta = JSX.IntrinsicElements['meta'];

export interface Props {
  title: string;
  lang?: string;
  meta?: Meta[];
  keywords?: string[];
}

interface QueryData {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      author: string;
    };
  };
}

const DETAILS_QUERY = graphql`
  query MetadataQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;

function getMeta(meta: Meta[], keywords: string[], data: QueryData): Meta[] {
  const { title, description, author } = data.site.siteMetadata;

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
      name: 'twitter:creator',
      content: author,
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
  const data = useStaticQuery<QueryData>(DETAILS_QUERY);
  return (
    <Helmet titleTemplate={`%s | ${data.site.siteMetadata.title}`} meta={getMeta(meta, keywords, data)}>
      <html lang={lang} />
      <title>{title}</title>
      <link rel="icon" type="image/png" href={require('../images/favicon-32x32.png')} sizes="32x32" />
      <link rel="icon" type="image/png" href={require('../images/favicon-16x16.png')} sizes="16x16" />
    </Helmet>
  );
};

export default DocHead;
