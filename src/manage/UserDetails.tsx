import styled from '@emotion/styled';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Session, Subscription, SubscriptionType, Training, User } from '../../shared/interfaces';
import Button, { Buttons } from '../components/bulma/Button';
import Card from '../components/bulma/Card';
import Dialog from '../components/bulma/Dialog';
import { Subtitle, Title } from '../components/bulma/Heading';
import { Tag, Tags } from '../components/bulma/Tags';
import { verticallySpaced } from '../utils/styles';
import AddEditSubscriptionDialog from './AddEditSubscriptionDialog';
import { formatLocale } from './dateTime';
import EditUserDialog from './EditUserDialog';
import { useRepos } from './RepoContext';
import { getSubscriptionName, getTrainingName } from './SubscriptionFormFields';

export interface Props {
  user: User;
  onCloseClick: React.MouseEventHandler;
}

type SubscriptionDialog = { type: 'ADD' } | { type: 'EDIT'; subscription: Subscription };

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

const SubscriptionSummary: React.FC<{ subscription: Subscription; onEditClick: React.MouseEventHandler }> = ({
  subscription,
  onEditClick,
}) => {
  const active =
    subscription.type === SubscriptionType.SINGLE ||
    subscription.type === SubscriptionType.UNLIMITED_10 ||
    DateTime.fromISO(subscription.end) > DateTime.local();
  return (
    <SubscriptionEntry>
      <HeaderLayout>
        <header>
          <Title text={getTrainingName(subscription.category)} size={6} />
          <Subtitle className="has-text-grey" text={getSubscriptionName(subscription.type)} size={6} />
        </header>
        {active ? (
          <Buttons>
            <Button title="Abo bearbeiten" icon="fa-edit" size="small" onClick={onEditClick} />
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
          <Tag text="Zahlung offen" intent="danger" />
        )}
      </Tags>
    </SubscriptionEntry>
  );
};

const UserDetails: React.FC<Props> = ({ user, onCloseClick }) => {
  const [subscriptions, setSubscriptions] = useState([] as Subscription[]);
  const [sessions, setSessions] = useState([] as Session[]);
  const [trainings, setTrainings] = useState([] as Training[]);
  const [subscriptionDialog, setSubscriptionDialog] = useState<SubscriptionDialog>();
  const [showDeleteDialog, setDeleteDialog] = useState(false);
  const [showEditDialog, setEditDialog] = useState(false);
  const { userRepo, sessionRepo, trainingRepo } = useRepos();

  useEffect(() => userRepo.observeAllSubscriptions(user.id, setSubscriptions), [userRepo, user]);
  useEffect(() => sessionRepo.observeAllForUser(user, setSessions), [sessionRepo, user]);
  useEffect(() => trainingRepo.observeAllForUser(user, setTrainings), [trainingRepo, user]);

  return (
    <>
      <LayoutCard>
        <HeaderLayout className="block">
          <header>
            <Title size={3} text={user.name} />
            <Subtitle className="has-text-grey" size={5} text={`Geboren am ${formatLocale(user.birthday)}`} />
          </header>
          <button className="delete is-medium" onClick={onCloseClick} />
        </HeaderLayout>
        <div className="columns">
          <Block className="column">
            <Title size={5} text="Kontaktdaten" />
            <div>
              <div>{`${user.address.street} ${user.address.number}`}</div>
              <div>{`${user.address.zip} ${user.address.city}`}</div>
              <a href={`mailto:${user.email}`}>{user.email}</a>
              <div>{user.phone}</div>
            </div>
            <Buttons>
              <Button text="Ändern" icon="fa-edit" size="small" onClick={() => setEditDialog(true)} />
              <Button text="Löschen" icon="fa-trash" size="small" onClick={() => setDeleteDialog(true)} />
            </Buttons>
          </Block>
          <Block className="column">
            <Title size={5} text="Abo(s)" />
            <SubscriptionsLayout>
              {subscriptions.map(subscription => (
                <SubscriptionSummary
                  key={subscription.id}
                  subscription={subscription}
                  onEditClick={() => setSubscriptionDialog({ type: 'EDIT', subscription })}
                />
              ))}
            </SubscriptionsLayout>
            <Button
              text="Hinzufügen"
              icon="fa-plus"
              size="small"
              onClick={() => setSubscriptionDialog({ type: 'ADD' })}
            />
          </Block>
          <Block className="column">
            <Title size={5} text="Trainingszeiten" />
            {trainings.map(training => (
              <div key={training.id}>{getTrainingName(training.type)}</div>
            ))}
          </Block>
        </div>
        <Title size={5}>Anwesenheit</Title>
        {sessions.length > 0 ? (
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Training</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id}>
                  <td>{session.date}</td>
                  <td>{session.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>Leider noch kein Training besucht…</div>
        )}
      </LayoutCard>
      {subscriptionDialog && (
        <AddEditSubscriptionDialog
          userId={user.id}
          subscription={subscriptionDialog.type === 'EDIT' ? subscriptionDialog.subscription : undefined}
          onSubscriptionChanged={() => setSubscriptionDialog(undefined)}
          onCancelClick={() => setSubscriptionDialog(undefined)}
        />
      )}
      {showDeleteDialog && (
        <Dialog
          title="Löschen bestätigen"
          body={<p>{`Bist du sicher, dass du ${user.name} löschen möchtest?`}</p>}
          footer={
            <>
              <Button
                text="Löschen"
                intent="danger"
                onClick={async () => {
                  await userRepo.delete(user.id);
                  setDeleteDialog(false);
                }}
              />
              <Button text="Abbrechen" onClick={() => setDeleteDialog(false)} />
            </>
          }
          onCloseClick={() => setDeleteDialog(false)}
        />
      )}
      {showEditDialog && (
        <EditUserDialog
          user={user}
          onUserUpdated={() => setEditDialog(false)}
          onCancelClick={() => setEditDialog(false)}
        />
      )}
    </>
  );
};

export default UserDetails;
