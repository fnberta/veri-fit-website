import cx from 'classnames';
import React from 'react';
import { CloseButton } from '@veri-fit/common-ui';

export type NotificationType = 'success' | 'error';

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  type: NotificationType;
  onCloseClick: React.MouseEventHandler<HTMLButtonElement>;
}

function getContentForType(type: NotificationType) {
  switch (type) {
    case 'success':
      return {
        pill: 'bg-orange-300 text-orange-800',
        text: 'Herzlichen Dank für deine Nachricht! Ich melde mich sofort bei dir.',
      };
    case 'error':
      return {
        pill: 'bg-red-300 text-red-800',
        text: 'Da ist etwas schief gegangen. Bitte versuche es nochmals!',
      };
  }
}

const Notification: React.FC<Props> = ({ type, onCloseClick, className, ...rest }) => {
  const { pill, text } = getContentForType(type);
  return (
    <div
      className={cx('px-4 py-2 leading-tight rounded flex items-center space-x-2', pill, className)}
      role="alert"
      {...rest}
    >
      <span className="flex-auto font-semibold text-left">{text}</span>
      <CloseButton onClick={onCloseClick} />
    </div>
  );
};

export default Notification;
