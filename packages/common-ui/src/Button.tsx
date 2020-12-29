import cx from 'classnames';
import React, { ComponentPropsWithoutRef, FC, isValidElement, ReactElement } from 'react';
import Icon, { IconName, Props as IconProps } from './Icon';

const BUTTON_SIZES = {
  sm: 'h-7 px-2 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  xl: 'h-14 px-8 text-xl',
};

export interface ButtonStyleProps {
  shape?: 'filled' | 'outlined' | 'text';
  colorScheme?: 'gray' | 'orange' | 'red' | 'custom';
  size?: keyof typeof BUTTON_SIZES;
}

const BUTTON =
  'inline-flex items-center justify-center font-semibold transition duration-150 ease-out rounded select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-800';

function getButtonShapeColorClasses(
  shape: ButtonStyleProps['shape'],
  colorScheme: ButtonStyleProps['colorScheme'],
): string {
  const shadow = 'shadow-sm hover:shadow active:shadow-none disabled:shadow-none';
  const grayText = 'text-gray-600 hover:text-gray-700 active:text-gray-700 hover:bg-gray-200 active:bg-gray-300';
  const orangeText =
    'text-orange-600 hover:text-orange-700 active:text-orange-700 hover:bg-orange-50 active:bg-orange-100';
  const redText = 'text-red-600 hover:text-red-700 active:text-red-700 hover:bg-red-50 active:bg-red-100';
  switch (shape) {
    case 'filled':
      return cx(shadow, {
        ['text-white bg-gray-600 hover:bg-gray-700 active:bg-gray-800 focus-visible:ring-gray-50']:
          colorScheme === 'gray',
        ['text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 focus-visible:ring-orange-300']:
          colorScheme === 'orange',
        ['text-white bg-red-500 hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-300']: colorScheme === 'red',
      });
    case 'outlined':
      return cx(shadow, 'border', {
        [`${grayText} border-gray-600 focus-visible:ring-gray-50`]: colorScheme === 'gray',
        [`${orangeText} border-orange-500 focus-visible:ring-orange-300`]: colorScheme === 'orange',
        [`${redText} focus-visible:ring-red-300`]: colorScheme === 'red',
      });
    case 'text':
      return cx({
        [`${grayText} focus-visible:ring-gray-50`]: colorScheme === 'gray',
        [`${orangeText} focus-visible:ring-orange-300`]: colorScheme === 'orange',
        [`${redText} focus-visible:ring-red-300`]: colorScheme === 'red',
      });
    default:
      return '';
  }
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
  function getContent() {
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
    } else {
      return children as ReactElement;
    }
  }

  const content = getContent();
  if (loading) {
    return (
      <div className="relative flex justify-center items-center">
        <span className="absolute spinner" />
        <span className="invisible">{content}</span>
        <span className="sr-only">Laden…</span>
      </div>
    );
  } else {
    return content;
  }
};

export function getButtonStyleClasses({
  shape = 'filled',
  colorScheme = 'gray',
  size = 'md',
}: ButtonStyleProps): string {
  return cx(BUTTON, getButtonShapeColorClasses(shape, colorScheme), BUTTON_SIZES[size]);
}

export interface ButtonProps extends ComponentPropsWithoutRef<'button'>, ButtonStyleProps, ButtonContentProps {}

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
    <ButtonContent icon={icon} loading={loading} size={size}>
      {children}
    </ButtonContent>
  </button>
);

export interface AnchorButtonProps
  extends ComponentPropsWithoutRef<'a'>,
    ButtonStyleProps,
    Omit<ButtonContentProps, 'loading'> {}

export const AnchorButton: FC<AnchorButtonProps> = ({
  shape,
  colorScheme,
  size,
  icon,
  children,
  className,
  ...rest
}) => (
  <a className={cx(getButtonStyleClasses({ shape, colorScheme, size }), className)} {...rest}>
    <ButtonContent icon={icon} size={size}>
      {children}
    </ButtonContent>
  </a>
);

export interface IconButtonContentProps {
  icon: IconName | ReactElement;
  loading?: boolean;
  label: string;
}

export function getIconButtonStyleClasses({
  shape = 'filled',
  colorScheme = 'gray',
  size = 'md',
}: ButtonStyleProps): string {
  return cx(BUTTON, getButtonShapeColorClasses(shape, colorScheme), {
    ['h-7 w-7']: size === 'sm',
    ['h-9 w-9']: size === 'md',
    ['h-12 w-12']: size === 'lg',
    ['h-14 w-14']: size === 'xl',
  });
}

export interface IconButtonProps extends ComponentPropsWithoutRef<'button'>, ButtonStyleProps, IconButtonContentProps {}

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
    className={cx(getIconButtonStyleClasses({ shape, colorScheme, size }), className)}
    aria-label={label}
    title={label}
    disabled={loading || disabled}
    {...rest}
  >
    <ButtonContent icon={icon} loading={loading} size={size} />
  </button>
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
