import React from 'react';
import Heading from '../components/bulma/Heading';
import Layout from '../components/Layout';

const NotFoundPage: React.FC = () => (
  <Layout title="404: Not found">
    <div className="section">
      <Heading text="Nothing to see here..." size={1} />
      <a href="/">Open main page</a>
    </div>
  </Layout>
);

export default NotFoundPage;
