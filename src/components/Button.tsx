import { Link, LinkProps } from '@reach/router';
import cx from 'classnames';
import React from 'react';

export interface ButtonStyleProps {
  color?: 'gray' | 'orange' | 'red' | 'none';
  shape?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large' | 'huge' | 'none';
}

export interface ButtonContentProps {
  icon?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps & ButtonContentProps;

function getShapeColorClasses(
  color: ButtonStyleProps['color'] = 'gray',
  shape: ButtonStyleProps['shape'] = 'filled',
): string {
  const shapeClasses = shape === 'outlined' && 'border hover:border-transparent';
  switch (color) {
    case 'none':
      return cx(shapeClasses);
    case 'gray':
      return cx('text-gray-700 hover:bg-gray-200 active:bg-gray-400', shapeClasses, {
        ['bg-gray-300 ']: shape === 'filled',
        ['border-gray-300']: shape === 'outlined',
      });
    case 'orange':
      return cx('text-white hover:bg-orange-400 active:bg-orange-600', shapeClasses, {
        ['bg-orange-500 ']: shape === 'filled',
        ['border-orange-500']: shape === 'outlined',
      });
    case 'red':
      return cx('text-white hover:bg-red-400 active:bg-red-600', shapeClasses, {
        ['bg-red-500']: shape === 'filled',
        ['border-red-500']: shape === 'outlined',
      });
  }
}

function getSizeClasses(size: ButtonStyleProps['size'] = 'medium'): string {
  switch (size) {
    case 'none':
      return '';
    case 'small':
      return 'text-xs py-1 px-2';
    case 'medium':
      return 'text-sm py-2 px-4';
    case 'large':
      return 'text-xl py-3 px-5';
    case 'huge':
      return 'text-xl py-4 px-8';
  }
}

const ButtonContent: React.FC<ButtonContentProps> = ({ icon, loading, children }) => {
  if (loading) {
    return (
      <div className="relative flex justify-center items-center">
        <span className="absolute spinner" />
        <span className="invisible">{children}</span>
      </div>
    );
  }

  if (icon) {
    const iconSpan = <span className={`fas ${icon} fill-current`} />;
    return children ? (
      <div>
        {iconSpan}
        <span className="ml-2">{children}</span>
      </div>
    ) : (
      iconSpan
    );
  }

  return children as React.ReactElement;
};

export const Button: React.FC<ButtonProps> = ({
  color,
  shape,
  size,
  icon,
  loading,
  disabled,
  children,
  className,
  ...rest
}) => (
  <button
    className={cx('btn', getSizeClasses(size), getShapeColorClasses(color, shape), className)}
    disabled={loading || disabled}
    {...rest}
  >
    <ButtonContent icon={icon} loading={loading}>
      {children}
    </ButtonContent>
  </button>
);

export interface IconButtonContentProps {
  icon: string;
  loading?: boolean;
  'aria-label': string;
}

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps & IconButtonContentProps;

export const IconButton: React.FC<IconButtonProps> = ({
  color,
  shape,
  size,
  icon,
  loading,
  disabled,
  className,
  ...rest
}) => (
  <button
    className={cx('btn', getSizeClasses(size), getShapeColorClasses(color, shape), className)}
    disabled={loading || disabled}
    {...rest}
  >
    <ButtonContent icon={icon} loading={loading} />
  </button>
);

export type AnchorButtonProps = React.HTMLProps<HTMLAnchorElement> & ButtonStyleProps & ButtonContentProps;

export const AnchorButton: React.FC<AnchorButtonProps> = ({
  color,
  shape,
  size,
  icon,
  loading,
  children,
  className,
  ...rest
}) => (
  <a className={cx('btn', getSizeClasses(size), getShapeColorClasses(color, shape), className)} {...rest}>
    <ButtonContent icon={icon} loading={loading}>
      {children}
    </ButtonContent>
  </a>
);

export type LinkButtonProps<T> = LinkProps<T> & ButtonStyleProps & ButtonContentProps;

export function LinkButton<T>({ color, shape, size, icon, loading, children, className, ...rest }: LinkButtonProps<T>) {
  return (
    <Link<T>
      className={cx('btn', getSizeClasses(size), getShapeColorClasses(color, shape), className)}
      {...(rest as any)}
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
      className={cx('btn', getSizeClasses(size), getShapeColorClasses(color, shape), className)}
      {...(rest as any)}
    >
      <ButtonContent icon={icon} loading={loading} />
    </Link>
  );
}
