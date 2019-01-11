const { resolve } = require('path');

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
