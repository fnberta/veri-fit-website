import styled from '@emotion/styled';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import { Session, Subscription, SubscriptionType, Training, Client } from '../../shared';
import Button, { Buttons } from '../components/bulma/Button';
import Card from '../components/bulma/Card';
import { Subtitle, Title } from '../components/bulma/Heading';
import { Tag, Tags } from '../components/bulma/Tags';
import { verticallySpaced } from '../utils/styles';
import AddSubscriptionDialog from './AddSubscriptionDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { formatLocale, getToday } from './dateTime';
import { getSubscriptionName, getTrainingName } from './displayNames';
import EditClientDialog from './EditClientDialog';
import { useRepos } from './repositories/RepoContext';

export interface Props {
  client: Client;
}

type ClientDialog =
  | { type: 'EDIT' }
  | { type: 'DELETE' }
  | { type: 'SUBSCRIPTION_ADD' }
  | { type: 'SUBSCRIPTION_DELETE'; subscription: Subscription };

const LayoutCard = styled(Card)({
  gridColumn: '1 / -1',
});

const HeaderLayout = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'baseline',
});

const Block = styled.div(verticallySpaced('0.75rem'));

const SubscriptionsLayout = styled.ul({
  border: '1px solid hsl(0, 0%, 71%)',
  padding: '0.75rem',
  maxHeight: '15rem',
  overflow: 'auto',
  'li:not(:last-child)': {
    borderBottom: '1px solid hsl(0, 0%, 86%)',
  },
});

const SubscriptionEntry = styled.li(verticallySpaced('0.75rem'), {
  padding: '0.75rem',
});

const SubscriptionSummary: React.FC<{
  subscription: Subscription;
  onSetPaidClick: React.MouseEventHandler;
  onDeleteClick: React.MouseEventHandler;
}> = ({ subscription, onSetPaidClick }) => {
  const active =
    subscription.type === SubscriptionType.SINGLE ||
    subscription.type === SubscriptionType.UNLIMITED_10 ||
    DateTime.fromISO(subscription.end) > DateTime.local();
  return (
    <SubscriptionEntry>
      <HeaderLayout>
        <header>
          <Title text={getTrainingName(subscription.trainingType)} size={6} />
          <Subtitle className="has-text-grey" text={getSubscriptionName(subscription.type)} size={6} />
        </header>
        {active ? (
          <Buttons>
            {subscription.paidAt == null && (
              <Button title="Auf bezahlt setzen" icon="fa-dollar-sign" size="small" onClick={onSetPaidClick} />
            )}
            <Button title="Abo löschen" icon="fa-trash" size="small" />
          </Buttons>
        ) : (
          <Button title="Erneuern" icon="fa-redo" size="small" />
        )}
      </HeaderLayout>
      <div>
        {subscription.type === SubscriptionType.SINGLE || subscription.type === SubscriptionType.UNLIMITED_10 ? (
          <div>
            {'Gültig ab '}
            <strong>{formatLocale(subscription.start)}</strong>
            {'.'}
          </div>
        ) : (
          <div>
            {'Läuft vom '}
            <strong>{formatLocale(subscription.start)}</strong>
            {' bis zum '}
            <strong>{formatLocale(subscription.end)}</strong>
            {'.'}
          </div>
        )}
        {subscription.type !== SubscriptionType.BLOCK && (
          <div>
            {'Noch '}
            <strong>{`${subscription.trainingsLeft} Trainings`}</strong>
            {' übrig.'}
          </div>
        )}
      </div>
      <Tags>
        {active ? <Tag text="Aktiv" intent="info" /> : <Tag text="Abgelaufen" intent="light" />}
        {subscription.paidAt ? (
          <Tag text={`Bezahlt am ${formatLocale(subscription.paidAt)}`} intent="success" />
        ) : (
          <Tag text="Unbezahlt" intent="danger" />
        )}
      </Tags>
    </SubscriptionEntry>
  );
};

const ClientDetails: React.FC<Props> = ({ client }) => {
  const [subscriptions, setSubscriptions] = useState([] as Subscription[]);
  const [sessions, setSessions] = useState([] as Session[]);
  const [trainings, setTrainings] = useState([] as Training[]);
  const [clientDialog, setClientDialog] = useState<ClientDialog>();
  const { clientRepo, sessionRepo, trainingRepo } = useRepos();

  useEffect(() => clientRepo.observeAllSubscriptions(client.id, setSubscriptions), [clientRepo, client.id]);
  useEffect(() => sessionRepo.observeAllForClients(client.id, setSessions), [sessionRepo, client.id]);
  useEffect(() => trainingRepo.observeAllForClients(client.id, setTrainings), [trainingRepo, client.id]);

  async function handleSetSubscriptionPaidClick(subscription: Subscription) {
    await clientRepo.updateSubscription(client.id, subscription.id, {
      ...subscription,
      paidAt: getToday(),
    });
  }

  return (
    <>
      <LayoutCard>
        <HeaderLayout className="block">
          <header>
            <Title size={3} text={client.name} />
            {client.birthday != null && (
              <Subtitle className="has-text-grey" size={5} text={`Geboren am ${formatLocale(client.birthday)}`} />
            )}
          </header>
          <Link className="delete is-medium" to="/manage/clients" />
        </HeaderLayout>
        <div className="columns">
          <Block className="column">
            <div>
              <Title size={5} text="Kontaktdaten" />
              {client.address != null ? (
                <>
                  <div>{`${client.address.street} ${client.address.number}`}</div>
                  <div>{`${client.address.zip} ${client.address.city}`}</div>
                </>
              ) : (
                <p>Keine Adresse gespeichert…</p>
              )}
              <a href={`mailto:${client.email}`}>{client.email}</a>
              <div>{client.phone}</div>
            </div>
            <Buttons>
              <Button text="Ändern" icon="fa-edit" size="small" onClick={() => setClientDialog({ type: 'EDIT' })} />
              <Button
                text="Löschen"
                icon="fa-trash"
                size="small"
                disabled={true}
                onClick={() => setClientDialog({ type: 'DELETE' })}
              />
            </Buttons>
          </Block>
          <Block className="column">
            <Title size={5} text="Abo(s)" />
            <SubscriptionsLayout>
              {subscriptions.map(subscription => (
                <SubscriptionSummary
                  key={subscription.id}
                  subscription={subscription}
                  onSetPaidClick={() => handleSetSubscriptionPaidClick(subscription)}
                  onDeleteClick={() => setClientDialog({ type: 'SUBSCRIPTION_DELETE', subscription })}
                />
              ))}
            </SubscriptionsLayout>
            <Button
              text="Hinzufügen"
              icon="fa-plus"
              size="small"
              onClick={() => setClientDialog({ type: 'SUBSCRIPTION_ADD' })}
            />
          </Block>
          <Block className="column">
            <Title size={5} text="Trainingszeiten" />
            {trainings.length > 0 ? (
              <table className="table is-striped is-fullwidth">
                <thead>
                  <tr>
                    <th>Training</th>
                    <th>Zeit</th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map(training => (
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
          </Block>
        </div>
        <Title size={5}>Anwesenheit</Title>
        {sessions.length > 0 ? (
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Training</th>
                <th>Zeit</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
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
      </LayoutCard>
      {clientDialog?.type === 'EDIT' && (
        <EditClientDialog
          client={client}
          onClientUpdated={() => setClientDialog(undefined)}
          onCancelClick={() => setClientDialog(undefined)}
        />
      )}
      {clientDialog?.type === 'DELETE' && (
        <ConfirmDeleteDialog
          name={client.name}
          onDeleteClick={async () => {
            await clientRepo.delete(client.id);
            setClientDialog(undefined);
          }}
          onCancelClick={() => setClientDialog(undefined)}
        />
      )}
      {clientDialog?.type === 'SUBSCRIPTION_ADD' && (
        <AddSubscriptionDialog
          clientId={client.id}
          onSubscriptionAdded={() => setClientDialog(undefined)}
          onCancelClick={() => setClientDialog(undefined)}
        />
      )}
      {clientDialog?.type === 'SUBSCRIPTION_DELETE' && (
        <ConfirmDeleteDialog
          name={getSubscriptionName(clientDialog.subscription.type)}
          onDeleteClick={async () => {
            await clientRepo.deleteSubscription(client.id, clientDialog.subscription.id);
            setClientDialog(undefined);
          }}
          onCancelClick={() => setClientDialog(undefined)}
        />
      )}
    </>
  );
};

export default ClientDetails;
