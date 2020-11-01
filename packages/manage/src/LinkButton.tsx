import { Link, LinkProps } from 'react-router-dom';
import cx from 'classnames';
import React from 'react';
import {
  ButtonContent,
  ButtonContentProps,
  ButtonStyleProps,
  getButtonStyleClasses,
  IconButtonContentProps,
} from '@veri-fit/common-ui';

export type LinkButtonProps<T> = LinkProps<T> & ButtonStyleProps & Omit<ButtonContentProps, 'loading'>;

export function LinkButton<T>({ shape, color, size, icon, children, className, ...rest }: LinkButtonProps<T>) {
  return (
    <Link<T> className={cx(getButtonStyleClasses({ shape, color, size }), className)} {...rest}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </Link>
  );
}

export type LinkIconButtonProps<T> = LinkProps<T> & ButtonStyleProps & Omit<IconButtonContentProps, 'loading'>;

export function LinkIconButton<T>({ shape, color, size, icon, label, className, ...rest }: LinkIconButtonProps<T>) {
  return (
    <Link<T> aria-label={label} className={cx(getButtonStyleClasses({ shape, color, size }), className)} {...rest}>
      <ButtonContent icon={icon} />
    </Link>
  );
}
