import React, { FC } from 'react';
import { Link } from 'gatsby';
import Layout from '../Layout';

const NotFoundPage: FC = () => (
  <Layout title="404: Not found">
    <section className="max-w-screen-xl mx-auto px-8 py-12">
      <header>
        <h1 className="text-3xl leading-tight">Nothing to see here...</h1>
        <Link className="link" to="/">
          Open main page
        </Link>
      </header>
    </section>
  </Layout>
);

export default NotFoundPage;
