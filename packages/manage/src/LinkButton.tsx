import { Link, LinkProps } from 'react-router-dom';
import cx from 'classnames';
import React from 'react';
import {
  ButtonContent,
  ButtonContentProps,
  ButtonStyleProps,
  getButtonStyleClasses,
  getIconButtonStyleClasses,
  IconButtonContentProps,
} from '@veri-fit/common-ui';

export interface LinkButtonProps<T> extends LinkProps<T>, ButtonStyleProps, Omit<ButtonContentProps, 'loading'> {}

export function LinkButton<T>({ shape, colorScheme, size, icon, children, className, ...rest }: LinkButtonProps<T>) {
  return (
    <Link<T> className={cx(getButtonStyleClasses({ shape, colorScheme, size }), className)} {...rest}>
      <ButtonContent icon={icon} size={size}>
        {children}
      </ButtonContent>
    </Link>
  );
}

export interface LinkIconButtonProps<T>
  extends LinkProps<T>,
    ButtonStyleProps,
    Omit<IconButtonContentProps, 'loading'> {}

export function LinkIconButton<T>({
  shape,
  colorScheme,
  size,
  icon,
  label,
  className,
  ...rest
}: LinkIconButtonProps<T>) {
  return (
    <Link<T>
      aria-label={label}
      className={cx(getIconButtonStyleClasses({ shape, colorScheme, size }), className)}
      {...rest}
    >
      <ButtonContent icon={icon} size={size} />
    </Link>
  );
}
