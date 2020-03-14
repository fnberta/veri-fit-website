import React from 'react';
import DocHead from './DocHead';
import './layout.css';

export interface Props {
  title: string;
}

const Layout: React.FC<Props> = ({ title, children }) => (
  <>
    <DocHead title={title} />
    {children}
  </>
);

export default Layout;
