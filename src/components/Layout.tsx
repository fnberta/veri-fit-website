import '@fortawesome/fontawesome-free/js/all.min.js';
import React from 'react';
import DocHead from './DocHead';
import './layout.css';

export interface Props {
  title: string;
}

const Layout: React.FC<Props> = ({ title, children }) => (
  <>
    <DocHead title={title} />
    <div className="antialiased text-gray-900 w-full h-full">{children}</div>
  </>
);

export default Layout;
