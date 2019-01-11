import styled from '@emotion/styled';
import '@fortawesome/fontawesome-free/js/all.min.js';
import React from 'react';
import Card from './bulma/Card';
import DocHead from './DocHead';
import './layout.scss';

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

export const FullHeightCard = styled(Card)({
  height: '100%',
});
