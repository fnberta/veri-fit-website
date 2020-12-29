import { Subscription, SubscriptionType } from '@veri-fit/common';
import React, { ComponentPropsWithoutRef, FC, MouseEventHandler, ReactNode } from 'react';
import { DateTime } from 'luxon';
import { IconButton } from '@veri-fit/common-ui';
import cx from 'classnames';
import { getSubscriptionName, getTrainingName } from '../displayNames';
import { formatLocale } from '../dateTime';
import Tag from '../Tag';

export interface Props extends ComponentPropsWithoutRef<'li'> {
  subscription: Subscription;
  onSetPaidClick: MouseEventHandler;
  onDeleteClick?: MouseEventHandler;
}

const SubscriptionItem: FC<Props> = ({ subscription, onSetPaidClick, onDeleteClick, className, ...rest }) => {
  const active =
    subscription.type === SubscriptionType.SINGLE ||
    subscription.type === SubscriptionType.UNLIMITED_10 ||
    DateTime.fromISO(subscription.end) > DateTime.local();

  const actions = [] as ReactNode[];
  if (subscription.paidAt == null) {
    actions.push(
      <IconButton
        key="paid"
        shape="outlined"
        size="sm"
        icon="currency-yen"
        label="Auf bezahlt setzen"
        onClick={onSetPaidClick}
      />,
    );
  }
  if (active) {
    if (onDeleteClick) {
      actions.push(
        <IconButton key="delete" shape="outlined" size="sm" icon="trash" label="Abo löschen" onClick={onDeleteClick} />,
      );
    }
  } else {
    actions.push(
      <IconButton key="renew" shape="outlined" size="sm" icon="document-duplicate" label="Erneuern" disabled={true} />,
    );
  }

  return (
    <li className={cx('space-y-2', className)} {...rest}>
      <div className="-ml-2 -mt-2 flex flex-wrap justify-between items-start">
        <header className="ml-2 mt-2">
          <p className="text-xs text-gray-600 uppercase tracking-wider">{getSubscriptionName(subscription.type)}</p>
          <h3 className="text-base font-semibold">{getTrainingName(subscription.trainingType)}</h3>
        </header>
        {actions.length > 0 && <div className="button-group ml-2 mt-2">{actions}</div>}
      </div>
      <div>
        {subscription.type === SubscriptionType.SINGLE || subscription.type === SubscriptionType.UNLIMITED_10 ? (
          <div className="text-sm">
            {'Gültig ab '}
            <strong>{formatLocale(subscription.start)}</strong>
            {'.'}
          </div>
        ) : (
          <div className="text-sm">
            {'Läuft vom '}
            <strong>{formatLocale(subscription.start)}</strong>
            {' bis zum '}
            <strong>{formatLocale(subscription.end)}</strong>
            {'.'}
          </div>
        )}
        {subscription.type !== SubscriptionType.BLOCK && (
          <div className="text-sm">
            {'Noch '}
            <strong>{`${subscription.trainingsLeft} Trainings`}</strong>
            {' übrig.'}
          </div>
        )}
      </div>
      <div className="space-x-1">
        {active ? <Tag color="blue">Aktiv</Tag> : <Tag color="orange">Abgelaufen</Tag>}
        {subscription.paidAt ? (
          <Tag color="green">{`Bezahlt am ${formatLocale(subscription.paidAt)}`}</Tag>
        ) : (
          <Tag color="red">Unbezahlt</Tag>
        )}
      </div>
    </li>
  );
};

export default SubscriptionItem;
