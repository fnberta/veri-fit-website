import { Link, LinkProps } from 'react-router-dom';
import cx from 'classnames';
import React from 'react';
import {
  ButtonContent,
  ButtonContentProps,
  ButtonStyleProps,
  getButtonShapeColorClasses,
  getButtonSizeClasses,
  IconButtonContentProps,
} from '@veri-fit/common-ui';

export type LinkButtonProps<T> = LinkProps<T> & ButtonStyleProps & ButtonContentProps;

export function LinkButton<T>({ color, shape, size, icon, loading, children, className, ...rest }: LinkButtonProps<T>) {
  return (
    <Link<T>
      className={cx('btn', getButtonSizeClasses(size), getButtonShapeColorClasses(color, shape), className)}
      {...rest}
    >
      <ButtonContent icon={icon} loading={loading}>
        {children}
      </ButtonContent>
    </Link>
  );
}

export type LinkIconButtonProps<T> = LinkProps<T> & ButtonStyleProps & IconButtonContentProps;

export function LinkIconButton<T>({ color, shape, size, icon, loading, className, ...rest }: LinkIconButtonProps<T>) {
  return (
    <Link<T>
      className={cx('btn', getButtonSizeClasses(size), getButtonShapeColorClasses(color, shape), className)}
      {...rest}
    >
      <ButtonContent icon={icon} loading={loading} />
    </Link>
  );
}
