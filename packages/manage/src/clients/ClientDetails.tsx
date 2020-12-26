import { DateTime } from 'luxon';
import React, { ComponentPropsWithoutRef, FC, MouseEventHandler, ReactNode, useEffect, useState } from 'react';
import { Client, Session, Subscription, SubscriptionType, Training } from '@veri-fit/common';
import { Button, Icon, IconButton, IconName } from '@veri-fit/common-ui';
import cx from 'classnames';
import Dialog from '../Dialog';
import ConfirmDeleteDialogContent from '../ConfirmDeleteDialogContent';
import { formatLocale, getToday } from '../dateTime';
import { getSubscriptionName, getTrainingName } from '../displayNames';
import { useRepos } from '../repositories/RepoContext';
import EditClientDialogContent from './EditClientDialogContent';
import AddSubscriptionDialogContent from './AddSubscriptionDialogContent';

export interface Props extends ComponentPropsWithoutRef<'div'> {
  client: Client;
}

type ClientDialog =
  | { type: 'EDIT' }
  | { type: 'DELETE' }
  | { type: 'SUBSCRIPTION_ADD' }
  | { type: 'SUBSCRIPTION_DELETE'; subscription: Subscription };

interface SummaryProps {
  subscription: Subscription;
  onSetPaidClick: MouseEventHandler;
  onDeleteClick: MouseEventHandler;
}

const SubscriptionSummary: FC<SummaryProps> = ({ subscription, onSetPaidClick, onDeleteClick }) => {
  const active =
    subscription.type === SubscriptionType.SINGLE ||
    subscription.type === SubscriptionType.UNLIMITED_10 ||
    DateTime.fromISO(subscription.end) > DateTime.local();
  return (
    <>
      <div className="-ml-2 -mt-2 flex flex-wrap justify-between items-start">
        <header className="ml-2 mt-2">
          <p className="text-xs text-gray-600 uppercase tracking-wider">{getSubscriptionName(subscription.type)}</p>
          <h3 className="text-base font-semibold">{getTrainingName(subscription.trainingType)}</h3>
        </header>
        <div className="button-group ml-2 mt-2">
          {subscription.paidAt == null && (
            <IconButton
              shape="outlined"
              size="sm"
              icon="currency-yen"
              label="Auf bezahlt setzen"
              onClick={onSetPaidClick}
            />
          )}
          {active ? (
            <IconButton shape="outlined" size="sm" icon="trash" label="Abo löschen" onClick={onDeleteClick} />
          ) : (
            <IconButton shape="outlined" size="sm" icon="document-duplicate" label="Erneuern" />
          )}
        </div>
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
        {active ? <div className="tag tag-blue">Aktiv</div> : <div className="tag tag-red">Abgelaufen</div>}
        {subscription.paidAt ? (
          <div className="tag tag-green">{`Bezahlt am ${formatLocale(subscription.paidAt)}`}</div>
        ) : (
          <div className="tag tag-red">Unbezahlt</div>
        )}
      </div>
    </>
  );
};

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
  const [subscriptions, setSubscriptions] = useState([] as Subscription[]);
  const [sessions, setSessions] = useState([] as Session[]);
  const [trainings, setTrainings] = useState([] as Training[]);
  const [clientDialog, setClientDialog] = useState<ClientDialog>();
  const { clientRepo, sessionRepo, trainingRepo } = useRepos();

  useEffect(() => clientRepo.observeAllSubscriptions(client.id, setSubscriptions), [clientRepo, client.id]);
  useEffect(() => sessionRepo.observeAllForClients(client.id, setSessions), [sessionRepo, client.id]);
  useEffect(() => trainingRepo.observeAllForClients(client.id, setTrainings), [trainingRepo, client.id]);

  const contactDetails = [] as ReactNode[];
  if (client.email) {
    contactDetails.push(
      <ContactItem icon="email">
        <a className="block link" href={`mailto:${client.email}`}>
          {client.email}
        </a>
      </ContactItem>,
    );
  }
  if (client.phone) {
    contactDetails.push(
      <ContactItem icon="phone-outgoing">
        <a className="block link" href={`tel:${client.phone}`}>
          {client.phone}
        </a>
      </ContactItem>,
    );
  }
  if (client.address) {
    contactDetails.push(
      <ContactItem icon="location-marker">
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
      <ContactItem icon="cake">
        <p className="text-base text-gray-600">{`Geboren am ${formatLocale(client.birthday)}`}</p>
      </ContactItem>,
    );
  }

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
        <h2 className="text-xl">Abos</h2>
        {subscriptions.length > 0 ? (
          <div className="flex flex-col space-y-2">
            <ul className="space-y-2">
              {subscriptions.map((subscription) => (
                <li key={subscription.id} className="p-4 border space-y-2">
                  <SubscriptionSummary
                    subscription={subscription}
                    onSetPaidClick={async () => {
                      await clientRepo.updateSubscription(client.id, subscription.id, {
                        ...subscription,
                        paidAt: getToday(),
                      });
                    }}
                    onDeleteClick={() => setClientDialog({ type: 'SUBSCRIPTION_DELETE', subscription })}
                  />
                </li>
              ))}
            </ul>
            <Button
              className="self-end"
              size="sm"
              shape="text"
              onClick={() => setClientDialog({ type: 'SUBSCRIPTION_ADD' })}
            >
              Hinzufügen
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <p className="text-sm">Die Kundin hat noch kein Abo. Füge jetzt eines hinzu.</p>
            <Button size="sm" onClick={() => setClientDialog({ type: 'SUBSCRIPTION_ADD' })}>
              Hinzufügen
            </Button>
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
      <Dialog open={clientDialog != null} onCancel={() => setClientDialog(undefined)}>
        {clientDialog?.type === 'EDIT' && (
          <EditClientDialogContent
            client={client}
            onClientUpdated={() => setClientDialog(undefined)}
            onCancelClick={() => setClientDialog(undefined)}
          />
        )}
        {clientDialog?.type === 'DELETE' && (
          <ConfirmDeleteDialogContent
            name={client.name}
            onDeleteClick={async () => {
              await clientRepo.delete(client.id);
              setClientDialog(undefined);
            }}
            onCancelClick={() => setClientDialog(undefined)}
          />
        )}
        {clientDialog?.type === 'SUBSCRIPTION_ADD' && (
          <AddSubscriptionDialogContent
            clientId={client.id}
            subscriptions={subscriptions}
            onSubscriptionAdded={() => setClientDialog(undefined)}
            onCancelClick={() => setClientDialog(undefined)}
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
            onCancelClick={() => setClientDialog(undefined)}
          />
        )}
      </Dialog>
    </section>
  );
};

export default ClientDetails;
