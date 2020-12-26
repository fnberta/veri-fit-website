import React, { ComponentPropsWithoutRef, FC } from 'react';
import cx from 'classnames';

const COLORS = {
  blue: 'bg-blue-200 text-blue-800',
  red: 'bg-red-200 text-red-800',
  green: 'bg-green-200 text-green-800',
  orange: 'bg-orange-200 text-orange-800',
  gray: 'bg-gray-200 text-gray-800',
};

export type TagColor = keyof typeof COLORS;

export interface Props extends ComponentPropsWithoutRef<'span'> {
  color: TagColor;
}

const Tag: FC<Props> = ({ color, children, className, ...rest }) => (
  <span
    className={cx(
      'inline-block px-2 rounded-full text-xs font-semibold uppercase tracking-wider',
      COLORS[color],
      className,
    )}
    {...rest}
  >
    {children}
  </span>
);

export default Tag;
