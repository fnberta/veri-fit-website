import React from 'react';
import cx from 'classnames';
import Icon from './Icon';

export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon?: string;
  intent?: 'primary' | 'danger';
  size?: 'small' | 'normal' | 'medium' | 'large';
  loading?: boolean;
  outlined?: boolean;
  nonInteractive?: boolean;
}

const Button: React.FC<Props> = ({
  text,
  icon,
  intent,
  size,
  loading,
  outlined,
  nonInteractive,
  className,
  ...rest
}) => (
  <button
    className={cx(
      'button',
      {
        'is-primary': intent === 'primary',
        'is-danger': intent === 'danger',
        'is-loading': loading,
        'is-small': size === 'small',
        'is-normal': size === 'normal',
        'is-medium': size === 'medium',
        'is-large': size === 'large',
        'is-outlined': outlined,
        'is-static': nonInteractive,
      },
      className,
    )}
    {...rest}
  >
    {icon ? (
      <>
        <Icon icon={icon} />
        {text && <span>{text}</span>}
      </>
    ) : (
      text
    )}
  </button>
);

export default Button;

export const Buttons: React.FC<React.ButtonHTMLAttributes<HTMLDivElement>> = ({ children, className, ...rest }) => (
  <div className={cx('buttons', 'has-addons', className)} {...rest}>
    {children}
  </div>
);
