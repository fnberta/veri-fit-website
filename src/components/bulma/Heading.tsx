import cx from 'classnames';
import React from 'react';
import { ClassNameProps } from '../../interfaces';

export interface Props extends ClassNameProps {
  text: React.ReactNode;
  size: 1 | 2 | 3 | 4 | 5 | 6;
  type?: 'title' | 'subtitle';
}

const Heading: React.FC<Props> = props => {
  const { type = 'title', size, text } = props;
  const className = cx(type, `is-${size}`, props.className);
  return React.createElement(`h${size}`, { className }, text);
};

export default Heading;
