/* eslint-disable @typescript-eslint/no-var-requires */

const { resolve } = require('path');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type SiteSiteMetadata {
      title: String!
      description: String!
      author: String!
    }
    
    type Site implements Node {
      siteMetadata: SiteSiteMetadata!
    }
  `;
  createTypes(typeDefs);
};

exports.createPages = async ({ actions, graphql }) => {
  const result = await graphql(`
    {
      allMarkdownRemark(filter: { frontmatter: { collection: { eq: "agb-page" } } }) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    throw new Error(result.errors);
  }

  const { edges } = result.data.allMarkdownRemark;
  if (edges.length !== 1) {
    throw new Error(`invalid length for edges: ${edges}`);
  }

  const { node } = edges[0];
  return actions.createPage({
    path: node.frontmatter.path,
    component: resolve('src/templates/AgbPageTemplate.tsx'),
  });
};

exports.onCreateNode = ({ node }) => {
  // converts any absolute paths in markdown frontmatter data into relative paths if a matching file is found
  // needed for netlify cms
  fmImagesToRelative(node);
};

exports.onCreatePage = ({ page, actions }) => {
  // page.matchPath is a special key that's used for matching pages only on the client.
  if (page.path.match(/^\/manage/)) {
    page.matchPath = '/manage/*';
    actions.createPage(page);
  }
};
