import cx from 'classnames';
import React, { isValidElement } from 'react';
import Icon, { IconName, Props as IconProps } from './Icon';

export interface ButtonStyleProps {
  shape?: 'filled' | 'outlined' | 'text';
  color?: 'gray' | 'orange' | 'red' | 'none';
  size?: 'small' | 'medium' | 'large' | 'huge';
}

export function getButtonStyleClasses({ shape = 'filled', color = 'gray', size = 'medium' }: ButtonStyleProps): string {
  return cx('button', {
    ['button-filled']: shape === 'filled',
    ['button-outlined']: shape === 'outlined',
    ['button-text']: shape === 'text',
    ['button-gray']: color === 'gray',
    ['button-orange']: color === 'orange',
    ['button-red']: color === 'red',
    ['button-small']: size === 'small',
    ['button-medium']: size === 'medium',
    ['button-large']: size === 'large',
    ['button-huge']: size === 'huge',
  });
}

export interface ButtonContentProps {
  icon?: IconName | React.ReactElement;
  loading?: boolean;
  children?: React.ReactNode;
}

function getIconSize(buttonSize: ButtonStyleProps['size'] = 'medium'): IconProps['size'] {
  switch (buttonSize) {
    case 'small':
    case 'medium':
      return 'normal';
    case 'large':
    case 'huge':
      return 'large';
  }
}

export const ButtonContent: React.FC<ButtonContentProps & Pick<ButtonStyleProps, 'size'>> = ({
  icon,
  size,
  loading,
  children,
}) => {
  if (loading) {
    return (
      <div className="relative flex justify-center items-center">
        <span className="absolute spinner" />
        <span className="invisible">{children}</span>
        <span className="sr-only">Laden…</span>
      </div>
    );
  }

  if (icon) {
    const iconElement = isValidElement(icon) ? icon : <Icon name={icon} size={getIconSize(size)} />;
    return children ? (
      <div className="flex items-center space-x-2">
        {iconElement}
        <span>{children}</span>
      </div>
    ) : (
      iconElement
    );
  }

  return children as React.ReactElement;
};

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> & ButtonStyleProps & ButtonContentProps;

export const Button: React.FC<ButtonProps> = ({
  shape,
  color,
  size,
  icon,
  loading,
  disabled,
  children,
  className,
  ...rest
}) => (
  <button
    className={cx(getButtonStyleClasses({ shape, color, size }), className)}
    disabled={loading || disabled}
    {...rest}
  >
    <ButtonContent icon={icon} loading={loading}>
      {children}
    </ButtonContent>
  </button>
);

export interface IconButtonContentProps {
  icon: IconName | React.ReactElement;
  loading?: boolean;
  label: string;
}

export type IconButtonProps = React.ComponentPropsWithoutRef<'button'> & ButtonStyleProps & IconButtonContentProps;

export const IconButton: React.FC<IconButtonProps> = ({
  shape,
  color,
  size,
  icon,
  loading,
  disabled,
  label,
  className,
  ...rest
}) => (
  <button
    className={cx(getButtonStyleClasses({ shape, color, size }), className)}
    aria-label={label}
    title={label}
    disabled={loading || disabled}
    {...rest}
  >
    <ButtonContent icon={icon} loading={loading} />
  </button>
);

export type AnchorButtonProps = React.ComponentPropsWithoutRef<'a'> & ButtonStyleProps & ButtonContentProps;

export const AnchorButton: React.FC<AnchorButtonProps> = ({
  shape,
  color,
  size,
  icon,
  loading,
  children,
  className,
  ...rest
}) => (
  <a className={cx(getButtonStyleClasses({ shape, color, size }), className)} {...rest}>
    <ButtonContent icon={icon} loading={loading}>
      {children}
    </ButtonContent>
  </a>
);
