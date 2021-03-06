import React, { ComponentPropsWithoutRef, FC } from 'react';
import cx from 'classnames';

export interface Props extends ComponentPropsWithoutRef<'div'> {
  body: string | Record<string, unknown>;
}

const Body: FC<Props> = ({ body, className, ...rest }) => {
  if (typeof body === 'string') {
    return <div className={cx('content', className)} dangerouslySetInnerHTML={{ __html: body }} {...rest} />;
  }

  return (
    <div className={cx('content', className)} {...rest}>
      {body}
    </div>
  );
};

export default Body;
