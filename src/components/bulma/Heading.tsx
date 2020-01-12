import cx from 'classnames';
import React from 'react';

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text?: React.ReactNode;
  size: 1 | 2 | 3 | 4 | 5 | 6;
}

interface HeadingProps extends TitleProps {
  type: 'title' | 'subtitle';
}

const Heading: React.FC<HeadingProps> = ({ type, size, text, className, children, ...rest }) => {
  return React.createElement(`h${size}`, { className: cx(type, `is-${size}`, className), ...rest }, text ?? children);
};

export const Title: React.FC<TitleProps> = props => <Heading type="title" {...props} />;

export const Subtitle: React.FC<TitleProps> = props => <Heading type="subtitle" {...props} />;
