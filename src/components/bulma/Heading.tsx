import cx from 'classnames';
import React from 'react';
import { ClassNameProps } from '../../interfaces';

export interface TitleProps extends ClassNameProps {
  text?: React.ReactNode;
  size: 1 | 2 | 3 | 4 | 5 | 6;
}

interface HeadingProps extends TitleProps {
  type: 'title' | 'subtitle';
}

const Heading: React.FC<HeadingProps> = props => {
  const { type, size, text, children } = props;
  const className = cx(type, `is-${size}`, props.className);
  return React.createElement(`h${size}`, { className }, text || children);
};

export const Title: React.FC<TitleProps> = props => <Heading type="title" {...props} />;

export const Subtitle: React.FC<TitleProps> = props => <Heading type="subtitle" {...props} />;
