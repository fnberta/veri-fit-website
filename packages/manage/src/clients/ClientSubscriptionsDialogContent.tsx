import React, { FC, useEffect, useState } from 'react';
import { Client, Subscription } from '@veri-fit/common';
import { Button } from '@veri-fit/common-ui';
import { useRepos } from '../repositories/RepoContext';
import { getToday } from '../dateTime';
import { DialogFooter, DialogHeader } from '../Dialog';
import SubscriptionItem from './SubscriptionItem';

export interface Props {
  client: Client;
  onCancelClick: () => void;
}

const ClientSubscriptionDialogContent: FC<Props> = ({ client, onCancelClick }) => {
  const { clientRepo } = useRepos();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>();

  useEffect(() => clientRepo.observeAllSubscriptions(client.id, setSubscriptions), [clientRepo, client.id]);

  return (
    <>
      <DialogHeader title={`${client.name}'s Abos`} onCloseClick={onCancelClick} />
      {subscriptions ? (
        subscriptions.length > 0 ? (
          <ul className="space-y-2 divide-y overflow-auto">
            {subscriptions.map((subscription) => (
              <SubscriptionItem
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
        )
      ) : null}
      <DialogFooter className="flex justify-end p-4">
        <Button onClick={onCancelClick}>Schliessen</Button>
      </DialogFooter>
    </>
  );
};

export default ClientSubscriptionDialogContent;
