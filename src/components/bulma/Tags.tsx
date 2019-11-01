import cx from 'classnames';
import React from 'react';

export interface TagProps extends React.HTMLProps<HTMLSpanElement> {
  text: React.ReactNode;
  intent?: 'light' | 'info' | 'danger' | 'success';
}

export const Tag: React.FC<TagProps> = ({ text, intent, className, ...rest }) => (
  <span
    className={cx(
      'tag',
      {
        'is-light': intent === 'light',
        'is-info': intent === 'info',
        'is-danger': intent === 'danger',
        'is-success': intent === 'success',
      },
      className,
    )}
    {...rest}
  >
    {text}
  </span>
);

export const Tags: React.FC<React.HTMLProps<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div className={cx('tags', className)} {...rest}>
    {children}
  </div>
);
