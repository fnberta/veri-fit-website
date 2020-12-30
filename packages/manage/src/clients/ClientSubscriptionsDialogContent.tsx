import React, { FC } from 'react';
import { Client, Subscription } from '@veri-fit/common';
import { Button } from '@veri-fit/common-ui';
import { useRepos } from '../repositories/RepoContext';
import { getToday } from '../dateTime';
import { DialogFooter, DialogHeader } from '../Dialog';
import SubscriptionListItem from './SubscriptionListItem';

export interface Props {
  client: Client;
  subscriptions: Subscription[];
  onCancelClick: () => void;
}

const ClientSubscriptionDialogContent: FC<Props> = ({ client, subscriptions, onCancelClick }) => {
  const { clientRepo } = useRepos();
  return (
    <>
      <DialogHeader title={`${client.name}'s Abos`} onCloseClick={onCancelClick} />
      <div className="dialog-body">
        {subscriptions.length > 0 ? (
          <ul className="space-y-2 divide-y">
            {subscriptions.map((subscription) => (
              <SubscriptionListItem
                key={subscription.id}
                className="p-4"
                subscription={subscription}
                onSetPaidClick={async () => {
                  await clientRepo.updateSubscription(client.id, subscription.id, {
                    ...subscription,
                    paidAt: getToday(),
                  });
                }}
              />
            ))}
          </ul>
        ) : (
          <p className="p-4 text-sm">
            {`${client.name} hatte noch keine Abos. Schliesse den Dialog um eines hinzuzufügen.`}
          </p>
        )}
      </div>
      <DialogFooter className="flex justify-end p-4">
        <Button onClick={onCancelClick}>Schliessen</Button>
      </DialogFooter>
    </>
  );
};

export default ClientSubscriptionDialogContent;
