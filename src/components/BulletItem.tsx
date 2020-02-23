import React from 'react';
import cx from 'classnames';

export interface Props {
  icon: string;
  title: string;
}

const BulletItem: React.FC<Props> = ({ icon, title, children }) => (
  <div className="flex flex-col items-center justify-center">
    <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center">
      <span className={cx(icon, 'fill-current text-orange-200')} />
    </div>
    <h4 className="mt-4 text-2xl font-semibold">{title}</h4>
    <div className="text-center">{children}</div>
  </div>
);

export default BulletItem;
