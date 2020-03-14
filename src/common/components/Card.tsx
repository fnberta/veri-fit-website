import cx from 'classnames';
import React from 'react';

export interface Props extends React.HTMLProps<HTMLDivElement> {
  image?: React.ReactNode;
}

const Card: React.FC<Props> = ({ image, className, children, ...rest }) => (
  <div className={cx('bg-white shadow rounded overflow-hidden', className)} {...rest}>
    {image && <div className="w-full">{image}</div>}
    <div className="px-6 py-4">{children}</div>
  </div>
);

export default Card;
