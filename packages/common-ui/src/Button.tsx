import cx from 'classnames';
import React, { ComponentPropsWithoutRef, FC, isValidElement, ReactElement } from 'react';
import Icon, { IconName, Props as IconProps } from './Icon';

export interface ButtonStyleProps {
  shape?: 'filled' | 'outlined' | 'text';
  colorScheme?: 'gray' | 'orange' | 'red' | 'custom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function getButtonStyleClasses({
  shape = 'filled',
  colorScheme = 'orange',
  size = 'md',
}: ButtonStyleProps): string {
  const shadow = 'shadow-sm hover:shadow active:shadow-none';
  const grayText = 'text-gray-900 hover:bg-gray-200 active:bg-gray-300';
  const orangeText =
    'text-orange-600 hover:text-orange-700 active:text-orange-700 hover:bg-orange-50 active:bg-orange-100';
  const redText = 'text-red-600 hover:text-red-700 active:text-red-700 hover:bg-red-50 active:bg-red-100';
  return cx(
    'inline-block font-semibold transition duration-150 ease-out rounded border select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-50 disabled:opacity-75 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-200 disabled:text-gray-800',
    {
      ['text-xs px-2 py-1']: size === 'sm',
      ['text-sm px-4 py-2']: size === 'md',
      ['text-xl px-5 py-3']: size === 'lg',
      ['text-xl px-8 py-4']: size === 'xl',
      [`${shadow} border-transparent`]: shape === 'filled',
      [`${shadow} disabled:border-transparent`]: shape === 'outlined',
      ['border-transparent']: shape === 'text',

      // gray
      ['focus-visible:ring-gray-50']: colorScheme === 'gray',
      ['text-gray-900 bg-gray-200 hover:bg-gray-300 active:bg-gray-400']: colorScheme === 'gray' && shape === 'filled',
      [`${grayText} border-gray-200`]: colorScheme === 'gray' && shape === 'outlined',
      [grayText]: colorScheme === 'gray' && shape === 'text',

      // orange
      ['focus-visible:ring-orange-300']: colorScheme === 'orange',
      ['text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700']:
        colorScheme === 'orange' && shape === 'filled',
      [`${orangeText} border-orange-500`]: colorScheme === 'orange' && shape === 'outlined',
      [orangeText]: colorScheme === 'orange' && shape === 'text',

      // red
      ['focus-visible:ring-red-300']: colorScheme === 'red',
      ['text-white bg-red-500 hover:bg-red-600 active:bg-red-700']: colorScheme === 'red' && shape === 'filled',
      [`${redText} border-red-500`]: colorScheme === 'red' && shape === 'outlined',
      [redText]: colorScheme === 'red' && shape === 'text',
    },
  );
}

export interface ButtonContentProps {
  icon?: IconName | ReactElement;
  loading?: boolean;
}

function getIconSize(buttonSize: ButtonStyleProps['size'] = 'md'): IconProps['size'] {
  switch (buttonSize) {
    case 'sm':
    case 'md':
      return 'md';
    case 'lg':
    case 'xl':
      return 'lg';
  }
}

export const ButtonContent: FC<ButtonContentProps & Pick<ButtonStyleProps, 'size'>> = ({
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

  return children as ReactElement;
};

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonStyleProps & ButtonContentProps;

export const Button: FC<ButtonProps> = ({
  shape,
  colorScheme,
  size,
  icon,
  loading,
  disabled,
  children,
  className,
  ...rest
}) => (
  <button
    className={cx(getButtonStyleClasses({ shape, colorScheme, size }), className)}
    disabled={loading || disabled}
    {...rest}
  >
    <ButtonContent icon={icon} loading={loading}>
      {children}
    </ButtonContent>
  </button>
);

export interface IconButtonContentProps {
  icon: IconName | ReactElement;
  loading?: boolean;
  label: string;
}

export type IconButtonProps = ComponentPropsWithoutRef<'button'> & ButtonStyleProps & IconButtonContentProps;

export const IconButton: FC<IconButtonProps> = ({
  shape,
  colorScheme,
  size,
  icon,
  loading,
  disabled,
  label,
  className,
  ...rest
}) => (
  <button
    className={cx(getButtonStyleClasses({ shape, colorScheme, size }), className)}
    aria-label={label}
    title={label}
    disabled={loading || disabled}
    {...rest}
  >
    <ButtonContent icon={icon} loading={loading} />
  </button>
);

export type AnchorButtonProps = ComponentPropsWithoutRef<'a'> & ButtonStyleProps & ButtonContentProps;

export const AnchorButton: FC<AnchorButtonProps> = ({
  shape,
  colorScheme,
  size,
  icon,
  loading,
  children,
  className,
  ...rest
}) => (
  <a className={cx(getButtonStyleClasses({ shape, colorScheme, size }), className)} {...rest}>
    <ButtonContent icon={icon} loading={loading}>
      {children}
    </ButtonContent>
  </a>
);

export interface CloseButtonProps extends ComponentPropsWithoutRef<'button'>, Pick<ButtonStyleProps, 'colorScheme'> {
  mode?: 'light' | 'dark';
}

export const CloseButton: FC<CloseButtonProps> = ({ mode = 'light', className, ...rest }) => (
  <IconButton
    className={cx(
      'bg-opacity-0 hover:bg-opacity-5 active:bg-opacity-10 text-current',
      {
        ['bg-black']: mode === 'light',
        ['bg-white']: mode === 'dark',
      },
      className,
    )}
    colorScheme="custom"
    shape="text"
    icon="x"
    label="Schliessen"
    {...rest}
  />
);
