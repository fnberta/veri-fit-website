import styled from '@emotion/styled';
import { DateTime } from 'luxon';
import React from 'react';
import { Client, Session, Training } from '../../shared';
import { getStartOfToday } from './dateTime';
import { getTrainingName } from './displayNames';
import { useRepos } from './repositories/RepoContext';
import { showSessionConfirm } from './subscriptionChecks';

export interface Props {
  session: Session;
  clients: Client[];
  onConfirmToggle: React.MouseEventHandler;
  onEditParticipantsClick: React.MouseEventHandler;
  onEditTrainingClick: (training: Training) => void;
}

const LinkButton = styled.button({
  border: 'none',
  font: 'inherit',
  color: 'hsl(217, 71%,  53%)',
  background: 'none',
  cursor: 'pointer',
  '&:hover': {
    color: 'hsl(0, 0%, 21%)',
  },
});

const SessionCard: React.FC<Props> = ({
  session,
  clients,
  onConfirmToggle,
  onEditParticipantsClick,
  onEditTrainingClick,
}) => {
  const { trainingRepo } = useRepos();

  // TODO: show loading state
  async function handleEditTrainingClick() {
    const training = await trainingRepo.get(session.trainingId);
    onEditTrainingClick(training);
  }

  return (
    <div className="card">
      <div className="card-content">
        <header>
          <h1 className="title is-5">{getTrainingName(session.category)}</h1>
          <h2 className="subtitle is-6">{`${session.time.start} - ${session.time.end}`}</h2>
        </header>
        <p>{`${session.clientIds.length} Teilnehmer`}</p>
        <p>{session.confirmed ? 'Bestätigt!' : 'Offen'}</p>
      </div>
      <footer className="card-footer">
        {DateTime.fromISO(session.date) <= getStartOfToday() && (
          <LinkButton
            className="card-footer-item"
            onClick={onConfirmToggle}
            disabled={!showSessionConfirm(clients, session)}
          >
            {session.confirmed ? 'Ändern' : 'Bestätigen'}
          </LinkButton>
        )}
        {!session.confirmed && (
          <LinkButton className="card-footer-item" onClick={onEditParticipantsClick}>
            Teilnehmer…
          </LinkButton>
        )}
        <LinkButton className="card-footer-item" onClick={handleEditTrainingClick}>
          Training…
        </LinkButton>
      </footer>
    </div>
  );
};

export default SessionCard;
