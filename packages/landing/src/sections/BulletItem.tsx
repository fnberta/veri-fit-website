import React from 'react';
import cx from 'classnames';
import { Icon, IconName } from '@veri-fit/common-ui';

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  icon: IconName;
  title: string;
}

const BulletItem: React.FC<Props> = ({ icon, title, children, className, ...rest }) => (
  <div className={cx('flex flex-col items-center justify-center', className)} {...rest}>
    <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center text-white">
      <Icon className="h-6 w-6" name={icon} />
    </div>
    <p className="mt-4 text-2xl font-semibold">{title}</p>
    <div className="text-lg text-center">{children}</div>
  </div>
);

export default BulletItem;
