module.exports = {
  siteMetadata: {
    title: 'Veri-Fit',
    description: 'Tone your body, calm your mind, get in shape – feel great!',
    author: 'Vera Lienhard',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/assets`,
        name: 'assets',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'testimonials',
        path: `${__dirname}/src/testimonials`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'offers',
        path: `${__dirname}/src/offers`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'schedule',
        path: `${__dirname}/src/schedule`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-relative-images',
            options: {
              name: 'assets',
            },
          },
          'gatsby-remark-images',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-typescript',
    'gatsby-plugin-tslint',
    'gatsby-plugin-emotion',
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.ts`,
      },
    },
    'gatsby-plugin-netlify',
  ],
};
