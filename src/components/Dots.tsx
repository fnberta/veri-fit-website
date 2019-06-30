import styled from '@emotion/styled';
import React from 'react';
import { range } from '../utils/numbers';

export interface Props {
  count: number;
  activeIdx: number;
  onDotClick: (idx: number) => void;
}

const Layout = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const DotLayout = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.5rem',
  height: '1.5rem',
  zIndex: 1,
  cursor: 'pointer',
});

const Circle = styled.span<{ active: boolean }>(
  {
    display: 'block',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'width 0.2s, height 0.2s',
  },
  ({ active }) => {
    const size = active ? '0.5rem' : '0.375rem';
    return {
      width: size,
      height: size,
    };
  },
);

const Dot: React.FC<{ active: boolean; onClick: React.MouseEventHandler<HTMLElement> }> = ({ active, onClick }) => (
  <DotLayout onClick={onClick}>
    <Circle active={active} />
  </DotLayout>
);

const Dots: React.FC<Props> = ({ count, activeIdx, onDotClick }) => (
  <Layout>
    {range(0, count).map(idx => (
      <Dot key={idx} active={activeIdx === idx} onClick={() => onDotClick(idx)} />
    ))}
  </Layout>
);

export default Dots;
