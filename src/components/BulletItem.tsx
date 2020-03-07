import React from 'react';
import cx from 'classnames';

export interface Props extends React.HTMLProps<HTMLDivElement> {
  icon: string;
  title: string;
}

const BulletItem: React.FC<Props> = ({ icon, title, children, className, ...rest }) => (
  <div className={cx('flex flex-col items-center justify-center', className)} {...rest}>
    <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center">
      <span className={cx(icon, 'fill-current text-white')} />
    </div>
    <h4 className="mt-4 text-2xl font-semibold">{title}</h4>
    <div className="text-lg text-center">{children}</div>
  </div>
);

export default BulletItem;
