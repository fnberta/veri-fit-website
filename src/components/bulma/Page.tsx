import React from 'react';
import cx from 'classnames';
import { ClassNameProps } from '../../interfaces';

export type Props = ClassNameProps & React.HTMLProps<HTMLDivElement>;

export const Section: React.FC<Props> = ({ className, children, ...rest }) => (
  <section className={cx('section', className)} {...rest}>
    {children}
  </section>
);

export const Container: React.FC<Props> = ({ className, children, ...rest }) => (
  <div className={cx('container', className)} {...rest}>
    {children}
  </div>
);
