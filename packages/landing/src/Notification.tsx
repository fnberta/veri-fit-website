import cx from 'classnames';
import React from 'react';
import { IconButton } from '@veri-fit/common-ui';

export type NotificationType = 'success' | 'error';

export interface Props extends React.HTMLProps<HTMLDivElement> {
  type: NotificationType;
  onCloseClick: React.MouseEventHandler<HTMLButtonElement>;
}

function getContentForType(type: NotificationType) {
  switch (type) {
    case 'success':
      return {
        classes: {
          pill: 'bg-orange-300 text-orange-800',
          close: 'hover:bg-orange-200 active:bg-orange-400',
        },
        text: 'Herzlichen Dank für deine Nachricht! Ich melde mich sofort bei dir.',
      };
    case 'error':
      return {
        classes: {
          pill: 'bg-red-300 text-red-800',
          close: 'hover:bg-red-200 active:bg-red-400',
        },
        text: 'Da ist etwas schief gegangen. Bitte versuche es nochmals!',
      };
  }
}

const Notification: React.FC<Props> = ({ type, onCloseClick, className, ...rest }) => {
  const { classes, text } = getContentForType(type);
  return (
    <div
      className={cx('px-4 py-2 leading-tight rounded-lg flex items-center', classes.pill, className)}
      role="alert"
      {...rest}
    >
      <span className="font-semibold text-left flex-auto">{text}</span>
      <IconButton
        className={cx('ml-2', classes.close)}
        color="none"
        icon="x"
        title="Schliessen"
        aria-label="Schliessen"
        onClick={onCloseClick}
      />
    </div>
  );
};

export default Notification;
