import cx from 'classnames';
import React from 'react';

export interface Props extends React.HTMLProps<HTMLDivElement> {
  image?: React.ReactNode;
}

const Card: React.FC<Props> = ({ image, className, children, ...rest }) => (
  <div className={cx('card', className)} {...rest}>
    {image && <div className="card-image">{image}</div>}
    <div className="card-content">{children}</div>
  </div>
);

export default Card;
