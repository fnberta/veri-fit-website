import React from 'react';
import Layout from '../Layout';

const NotFoundPage: React.FC = () => (
  <Layout title="404: Not found">
    <section className="max-w-screen-xl mx-auto px-8 py-12">
      <header>
        <h1 className="text-3xl leading-tight">Nothing to see here...</h1>
        <a className="link" href="/">
          Open main page
        </a>
      </header>
    </section>
  </Layout>
);

export default NotFoundPage;
