import cx from 'classnames';
import React from 'react';

export interface StyleProps {
  color?: 'gray' | 'orange' | 'red';
  shape?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large' | 'huge';
}

export interface ContentProps {
  icon?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & StyleProps & ContentProps;

function getShapeColorClasses(color: StyleProps['color'] = 'gray', shape: StyleProps['shape'] = 'filled'): string {
  const shapeClasses = shape === 'outlined' && 'border hover:border-transparent';
  switch (color) {
    case 'gray':
      return cx('text-gray-700 hover:bg-gray-200 active:bg-gray-400', shapeClasses, {
        ['bg-gray-300 ']: shape === 'filled',
        ['border-gray-500']: shape === 'outlined',
      });
    case 'orange':
      return cx('text-orange-800 hover:bg-orange-400 active:bg-orange-600', shapeClasses, {
        ['bg-orange-500 ']: shape === 'filled',
        ['border-orange-500']: shape === 'outlined',
      });
    case 'red':
      return cx('text-red-800 hover:bg-red-400 active:bg-red-600', shapeClasses, {
        ['bg-red-500']: shape === 'filled',
        ['border-red-500']: shape === 'outlined',
      });
  }
}

function getSizeClasses(size: StyleProps['size'] = 'medium'): string {
  switch (size) {
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

export const Button: React.FC<Props> = ({
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
    className={cx(
      'rounded font-semibold transition-all duration-200 focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed',
      getSizeClasses(size),
      getShapeColorClasses(color, shape),
      className,
    )}
    disabled={loading || disabled}
    {...rest}
  >
    {loading ? (
      <div className="relative flex justify-center items-center">
        <span className="absolute spinner" />
        <span className="invisible">{children}</span>
      </div>
    ) : icon ? (
      <div>
        <span className={`fas ${icon} fill-current`} />
        <span className="ml-2">{children}</span>
      </div>
    ) : (
      children
    )}
  </button>
);
