/* eslint-disable @typescript-eslint/camelcase */

module.exports = {
  siteMetadata: {
    title: 'Veri-Fit',
    description: 'Tone your body, calm your mind, get in shape – feel great!',
    author: 'Vera Lienhard',
  },
  plugins: [
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
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
        path: `${__dirname}/src/landing/testimonials`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'offers',
        path: `${__dirname}/src/landing/offers`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'schedule',
        path: `${__dirname}/src/landing/schedule`,
      },
    },
    'gatsby-plugin-typescript',
    'gatsby-plugin-postcss',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-portal',
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.ts`,
      },
    },
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Veri-Fit',
        short_name: 'Veri-Fit',
        scope: '/manage/',
        start_url: '/manage/',
        background_color: '#27303f',
        theme_color: '#ff5a1f',
        display: 'standalone',
        icon: 'src/images/logo_icon.png',
      },
    },
    'gatsby-plugin-offline',
  ],
};
