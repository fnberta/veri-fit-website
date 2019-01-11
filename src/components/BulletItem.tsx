import styled from '@emotion/styled';
import React from 'react';
import Heading from './bulma/Heading';
import Icon from './bulma/Icon';

export interface Props {
  icon: string;
  title: string;
}

const Layout = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const CircleIcon = styled(Icon)({
  borderRadius: '50%',
  marginBottom: '0.75rem',
});

const BulletItem: React.FC<Props> = ({ icon, title, children }) => (
  <Layout className="has-text-centered">
    <CircleIcon className="is-large fa-lg has-background-light" icon={icon} />
    <Heading className="has-text-light" text={title} size={4} />
    <Heading className="has-text-light" text={children} size={6} type="subtitle" />
  </Layout>
);

export default BulletItem;
