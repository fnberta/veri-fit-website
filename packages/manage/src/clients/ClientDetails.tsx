import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Session, Subscription, SubscriptionType, Training, Client } from '@veri-fit/common';
import { Button, IconButton } from '@veri-fit/common-ui';
import Dialog from '../Dialog';
import ConfirmDeleteDialogContent from '../ConfirmDeleteDialogContent';
import { formatLocale, getToday } from '../dateTime';
import { getSubscriptionName, getTrainingName } from '../displayNames';
import { useRepos } from '../repositories/RepoContext';
import EditClientDialogContent from './EditClientDialogContent';
import AddSubscriptionDialogContent from './AddSubscriptionDialogContent';

export interface Props extends React.HTMLProps<HTMLDivElement> {
  client: Client;
}

type ClientDialog =
  | { type: 'EDIT' }
  | { type: 'DELETE' }
  | { type: 'SUBSCRIPTION_ADD' }
  | { type: 'SUBSCRIPTION_DELETE'; subscription: Subscription };

const SubscriptionSummary: React.FC<{
  subscription: Subscription;
  onSetPaidClick: React.MouseEventHandler;
  onDeleteClick: React.MouseEventHandler;
}> = ({ subscription, onSetPaidClick, onDeleteClick }) => {
  const active =
    subscription.type === SubscriptionType.SINGLE ||
    subscription.type === SubscriptionType.UNLIMITED_10 ||
    DateTime.fromISO(subscription.end) > DateTime.local();
  return (
    <>
      <div className="flex justify-between items-start">
        <header>
          <p className="text-xs text-gray-600 uppercase tracking-wider">{getSubscriptionName(subscription.type)}</p>
          <h3 className="text-base font-semibold">{getTrainingName(subscription.trainingType)}</h3>
        </header>
        <div>
          {subscription.paidAt == null && (
            <IconButton
              className="rounded-none rounded-l"
              shape="outlined"
              size="small"
              icon="currency-yen"
              title="Auf bezahlt setzen"
              aria-label="Auf bezahlt setzen"
              onClick={onSetPaidClick}
            />
          )}
          {active ? (
            <IconButton
              className="rounded-none rounded-r -ml-px"
              shape="outlined"
              size="small"
              icon="trash"
              title="Abo löschen"
              aria-label="Abo löschen"
              onClick={onDeleteClick}
            />
          ) : (
            <IconButton
              className="rounded-none rounded-r -ml-px"
              shape="outlined"
              size="small"
              icon="document-duplicate"
              title="Erneuern"
              aria-label="Erneuern"
            />
          )}
        </div>
      </div>
      <div className="mt-2">
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
      <div className="mt-2 -ml-1">
        {active ? <div className="ml-1 tag tag-blue">Aktiv</div> : <div className="tag tag-red">Abgelaufen</div>}
        {subscription.paidAt ? (
          <div className="ml-1 tag tag-green">{`Bezahlt am ${formatLocale(subscription.paidAt)}`}</div>
        ) : (
          <div className="ml-1 tag tag-red">Unbezahlt</div>
        )}
      </div>
    </>
  );
};

const ClientDetails: React.FC<Props> = ({ client, className, ...rest }) => {
  const [subscriptions, setSubscriptions] = useState([] as Subscription[]);
  const [sessions, setSessions] = useState([] as Session[]);
  const [trainings, setTrainings] = useState([] as Training[]);
  const [clientDialog, setClientDialog] = useState<ClientDialog>();
  const { clientRepo, sessionRepo, trainingRepo } = useRepos();

  useEffect(() => clientRepo.observeAllSubscriptions(client.id, setSubscriptions), [clientRepo, client.id]);
  useEffect(() => sessionRepo.observeAllForClients(client.id, setSessions), [sessionRepo, client.id]);
  useEffect(() => trainingRepo.observeAllForClients(client.id, setTrainings), [trainingRepo, client.id]);

  return (
    <section className={className} {...rest}>
      <header>
        <h1 className="text-3xl font-semibold">{client.name}</h1>
        {client.birthday != null && (
          <p className="text-base text-gray-600">{`Geboren am ${formatLocale(client.birthday)}`}</p>
        )}
      </header>
      <div className="mt-2 -ml-6 flex flex-wrap">
        <div className="mt-6 ml-6">
          <div>
            <h2 className="text-xl font-semibold">Kontaktdaten</h2>
            <div className="mt-2">
              {client.address != null ? (
                <a
                  className="block link"
                  href={`https://www.google.ch/maps?q=${client.address.street}+${client.address.number}+${client.address.zip}+${client.address.city}`}
                >
                  {`${client.address.street} ${client.address.number}`}
                  <br />
                  {`${client.address.zip} ${client.address.city}`}
                </a>
              ) : (
                <p>Keine Adresse gespeichert…</p>
              )}
              <a className="block link" href={`mailto:${client.email}`}>
                {client.email}
              </a>
              <a className="block link" href={`tel:${client.phone}`}>
                {client.phone}
              </a>
            </div>
          </div>
          <div className="-ml-2 flex flex-wrap">
            <Button className="mt-2 ml-2" size="small" icon="pencil" onClick={() => setClientDialog({ type: 'EDIT' })}>
              Ändern
            </Button>
            <Button
              className="mt-2 ml-2"
              size="small"
              icon="user-remove"
              disabled={true}
              onClick={() => setClientDialog({ type: 'DELETE' })}
            >
              Löschen
            </Button>
          </div>
        </div>
        <div className="mt-6 ml-6">
          <h2 className="text-xl font-semibold">Abos</h2>
          <div className="mt-2">
            <ul className="h-56 px-2 border overflow-auto divide-y">
              {subscriptions.map((subscription) => (
                <li key={subscription.id} className="py-4 px-2">
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
              className="mt-2"
              size="small"
              icon="document-add"
              onClick={() => setClientDialog({ type: 'SUBSCRIPTION_ADD' })}
            >
              Hinzufügen
            </Button>
          </div>
        </div>
        <div className="mt-6 ml-6 flex-auto">
          <h2 className="text-xl font-semibold">Trainingszeiten</h2>
          <div className="mt-2">
            {trainings.length > 0 ? (
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
            ) : (
              <p>Noch keine Trainingszeiten gesetzt…</p>
            )}
          </div>
        </div>
        <div className="mt-6 ml-6 flex-auto">
          <h2 className="text-xl font-semibold">Anwesenheit</h2>
          <div className="mt-2">
            {sessions.length > 0 ? (
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
            ) : (
              <p>Leider noch kein Training besucht…</p>
            )}
          </div>
        </div>
      </div>
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
