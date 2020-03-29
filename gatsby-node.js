/* eslint-disable @typescript-eslint/no-var-requires */

const { resolve } = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
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
    query {
      allMarkdownRemark(filter: { fields: { slug: { ne: null } } }) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    throw new Error(result.errors);
  }

  result.data.allMarkdownRemark.edges.forEach((edge) => {
    const { slug } = edge.node.fields;
    switch (slug) {
      case '/agb/': {
        actions.createPage({
          path: slug,
          component: resolve('src/templates/AgbPageTemplate.tsx'),
          context: {
            slug,
          },
        });
        break;
      }
      default:
        throw new Error(`no template for ${slug}`);
    }
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  // converts any absolute paths in markdown frontmatter data into relative paths if a matching file is found
  // needed for netlify cms
  fmImagesToRelative(node);

  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    // add source name to be able to filter in queries
    const fileNode = getNode(node.parent);
    createNodeField({
      node,
      name: 'collection',
      value: fileNode.sourceInstanceName,
    });

    // add slug to pages
    if (node.fields.collection === 'pages') {
      const slug = createFilePath({
        node,
        getNode,
        basePath: 'pages',
      });
      createNodeField({
        node,
        name: 'slug',
        value: slug,
      });
    }
  }
};

exports.onCreatePage = ({ page, actions }) => {
  // page.matchPath is a special key that's used for matching pages only on the client.
  if (page.path.match(/^\/manage/)) {
    page.matchPath = '/manage/*';
    actions.createPage(page);
  }
};
