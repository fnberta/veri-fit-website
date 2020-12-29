import React, { ComponentPropsWithoutRef, FC, ReactNode, useEffect, useState } from 'react';
import { Client, Session, Subscription, Training } from '@veri-fit/common';
import { Button, Icon, IconButton, IconName } from '@veri-fit/common-ui';
import cx from 'classnames';
import Dialog from '../Dialog';
import ConfirmDeleteDialogContent from '../ConfirmDeleteDialogContent';
import { formatLocale, getToday } from '../dateTime';
import { getSubscriptionName, getTrainingName } from '../displayNames';
import { useRepos } from '../repositories/RepoContext';
import EditClientDialogContent from './EditClientDialogContent';
import AddSubscriptionDialogContent from './AddSubscriptionDialogContent';
import SubscriptionListItem from './SubscriptionListItem';
import ClientSubscriptionDialogContent from './ClientSubscriptionsDialogContent';

export interface Props extends ComponentPropsWithoutRef<'div'> {
  client: Client;
}

type ClientDialog =
  | { type: 'EDIT' }
  | { type: 'DELETE' }
  | { type: 'SUBSCRIPTION_ADD' }
  | { type: 'SUBSCRIPTION_DELETE'; subscription: Subscription }
  | { type: 'ALL_SUBSCRIPTIONS' };

const ContactItem: FC<{ icon: IconName }> = ({ icon, children }) => (
  <div className="flex space-x-8">
    <Icon className="flex-shrink-0 text-gray-500" name={icon} />
    {children}
  </div>
);

function getInitials(name: string) {
  const [firstName, lastName] = name.split(' ');
  return firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : firstName.charAt(0);
}

const ClientDetails: FC<Props> = ({ client, className, ...rest }) => {
  const [sessions, setSessions] = useState([] as Session[]);
  const [trainings, setTrainings] = useState([] as Training[]);
  const [clientDialog, setClientDialog] = useState<ClientDialog>();
  const { clientRepo, sessionRepo, trainingRepo } = useRepos();

  useEffect(() => sessionRepo.observeAllForClients(client.id, setSessions), [sessionRepo, client.id]);
  useEffect(() => trainingRepo.observeAllForClients(client.id, setTrainings), [trainingRepo, client.id]);

  const contactDetails = [] as ReactNode[];
  if (client.email) {
    contactDetails.push(
      <ContactItem key="email" icon="email">
        <a className="block link" href={`mailto:${client.email}`}>
          {client.email}
        </a>
      </ContactItem>,
    );
  }
  if (client.phone) {
    contactDetails.push(
      <ContactItem key="phone" icon="phone-outgoing">
        <a className="block link" href={`tel:${client.phone}`}>
          {client.phone}
        </a>
      </ContactItem>,
    );
  }
  if (client.address) {
    contactDetails.push(
      <ContactItem key="address" icon="location-marker">
        <a
          className="block link"
          href={`https://www.google.ch/maps?q=${client.address.street}+${client.address.number}+${client.address.zip}+${client.address.city}`}
        >
          {`${client.address.street} ${client.address.number}, ${client.address.zip} ${client.address.city}`}
        </a>
      </ContactItem>,
    );
  }
  if (client.birthday) {
    contactDetails.push(
      <ContactItem key="birthday" icon="cake">
        <p className="text-base text-gray-600">{`Geboren am ${formatLocale(client.birthday)}`}</p>
      </ContactItem>,
    );
  }

  const handleDialogClose = () => setClientDialog(undefined);
  return (
    <section className={cx('py-4 sm:py-6 space-y-6', className)} {...rest}>
      <header className="px-4 sm:px-6 flex items-center justify-between space-x-6">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 inline-flex items-center justify-center rounded-full bg-gray-200">
            {getInitials(client.name)}
          </div>
          <h1 className="text-3xl whitespace-nowrap">{client.name}</h1>
        </div>
        <div className="flex space-x-2">
          <IconButton
            shape="text"
            size="sm"
            icon="pencil"
            label="Ändern"
            onClick={() => setClientDialog({ type: 'EDIT' })}
          />
          <IconButton
            shape="text"
            size="sm"
            colorScheme="red"
            icon="trash"
            label="Löschen"
            disabled={true}
            onClick={() => setClientDialog({ type: 'DELETE' })}
          />
        </div>
      </header>
      {contactDetails.length > 0 && (
        <>
          <hr />
          <div className="px-4 sm:px-6 space-y-4">
            <h2 className="text-xl">Kontaktdaten</h2>
            <div className="space-y-3">{contactDetails}</div>
          </div>
        </>
      )}
      <hr />
      <div className="px-4 sm:px-6 space-y-4">
        <h2 className="text-xl">Aktive Abos</h2>
        {client.activeSubscriptions.length > 0 ? (
          <div className="flex flex-col space-y-2">
            <ul className="space-y-2">
              {client.activeSubscriptions.map((subscription) => (
                <SubscriptionListItem
                  key={subscription.id}
                  className="p-4 border"
                  subscription={subscription}
                  onSetPaidClick={async () => {
                    await clientRepo.updateSubscription(client.id, subscription.id, {
                      ...subscription,
                      paidAt: getToday(),
                    });
                  }}
                  onDeleteClick={() => setClientDialog({ type: 'SUBSCRIPTION_DELETE', subscription })}
                />
              ))}
            </ul>
            <div className="self-end space-x-2">
              <Button size="sm" shape="text" onClick={() => setClientDialog({ type: 'ALL_SUBSCRIPTIONS' })}>
                Zeige alle Abos…
              </Button>
              <Button size="sm" shape="outlined" onClick={() => setClientDialog({ type: 'SUBSCRIPTION_ADD' })}>
                Hinzufügen
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <p className="text-sm">{`${client.name} hat kein aktives Abo. Füge jetzt eines hinzu.`}</p>
            <div className="flex flex-col items-center justify-center space-y-2">
              <Button size="sm" onClick={() => setClientDialog({ type: 'SUBSCRIPTION_ADD' })}>
                Hinzufügen
              </Button>
              <Button size="sm" shape="text" onClick={() => setClientDialog({ type: 'ALL_SUBSCRIPTIONS' })}>
                Zeige alle Abos…
              </Button>
            </div>
          </div>
        )}
      </div>
      {trainings.length > 0 && (
        <>
          <hr />
          <div className="px-4 sm:px-6 space-y-4">
            <h2 className="text-xl">Trainingszeiten</h2>
            <table className="w-full table table-auto">
              <thead>
                <tr>
                  <th>Training</th>
                  <th>Zeit</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((training) => (
                  <tr key={training.id}>
                    <td>{getTrainingName(training.type)}</td>
                    <td>{`${training.time.start} - ${training.time.end}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {sessions.length > 0 && (
        <>
          <hr />
          <div className="px-4 sm:px-6 space-y-4">
            <h2 className="text-xl">Anwesenheit</h2>
            <table className="w-full table table-auto">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Training</th>
                  <th>Zeit</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.date}</td>
                    <td>{getTrainingName(session.type)}</td>
                    <td>{`${session.time.start} - ${session.time.end}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <Dialog open={clientDialog != null} onCancel={handleDialogClose}>
        {clientDialog?.type === 'EDIT' && (
          <EditClientDialogContent
            client={client}
            onClientUpdated={handleDialogClose}
            onCancelClick={handleDialogClose}
          />
        )}
        {clientDialog?.type === 'DELETE' && (
          <ConfirmDeleteDialogContent
            name={client.name}
            onDeleteClick={async () => {
              await clientRepo.delete(client.id);
              setClientDialog(undefined);
            }}
            onCancelClick={handleDialogClose}
          />
        )}
        {clientDialog?.type === 'SUBSCRIPTION_ADD' && (
          <AddSubscriptionDialogContent
            clientId={client.id}
            subscriptions={client.activeSubscriptions}
            onSubscriptionAdded={handleDialogClose}
            onCancelClick={handleDialogClose}
          />
        )}
        {clientDialog?.type === 'SUBSCRIPTION_DELETE' && (
          <ConfirmDeleteDialogContent
            name={`das Abo "${getTrainingName(clientDialog.subscription.trainingType)} - ${getSubscriptionName(
              clientDialog.subscription.type,
            )}"`}
            onDeleteClick={async () => {
              await clientRepo.deleteSubscription(client.id, clientDialog.subscription.id);
              setClientDialog(undefined);
            }}
            onCancelClick={handleDialogClose}
          />
        )}
        {clientDialog?.type === 'ALL_SUBSCRIPTIONS' && (
          <ClientSubscriptionDialogContent client={client} onCancelClick={handleDialogClose} />
        )}
      </Dialog>
    </section>
  );
};

export default ClientDetails;
