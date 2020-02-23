import React from 'react';
import Layout from '../components/Layout';

const NotFoundPage: React.FC = () => (
  <Layout title="404: Not found">
    <div className="container mx-auto px-8 py-12">
      <h1 className="text-3xl leading-tight">Nothing to see here...</h1>
      <a className="link" href="/">
        Open main page
      </a>
    </div>
  </Layout>
);

export default NotFoundPage;
