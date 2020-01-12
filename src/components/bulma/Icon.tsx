import cx from 'classnames';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  icon: string;
}

const Icon: React.FC<Props> = ({ icon, className, ...rest }) => (
  <span className={cx('icon', className)} {...rest}>
    <i className={cx('fas', icon)} />
  </span>
);

export default Icon;
