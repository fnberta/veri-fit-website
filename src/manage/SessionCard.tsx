import styled from '@emotion/styled';
import React from 'react';
import { Client, Session } from '../../shared';
import { getToday } from './dateTime';
import { getTrainingName } from './displayNames';
import { showSessionConfirm } from './subscriptionChecks';

export interface Props {
  session: Session;
  clients: Client[];
  onConfirmToggle: React.MouseEventHandler;
  onEditClick: React.MouseEventHandler;
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

const SessionCard: React.FC<Props> = ({ session, clients, onConfirmToggle, onEditClick }) => (
  <div className="card">
    <div className="card-content">
      <header>
        <h1 className="title is-5">{getTrainingName(session.type)}</h1>
        <h2 className="subtitle is-6">{`${session.time.start} - ${session.time.end}`}</h2>
      </header>
      <p>{`${session.clientIds.length} Teilnehmer`}</p>
      <p>{session.confirmed ? 'Bestätigt!' : 'Offen'}</p>
    </div>
    <footer className="card-footer">
      {session.date <= getToday() && (
        <LinkButton
          className="card-footer-item"
          disabled={!showSessionConfirm(clients, session)}
          onClick={onConfirmToggle}
        >
          {session.confirmed ? 'Öffnen' : 'Bestätigen'}
        </LinkButton>
      )}
      {!session.confirmed && (
        <LinkButton className="card-footer-item" onClick={onEditClick}>
          Bearbeiten…
        </LinkButton>
      )}
    </footer>
  </div>
);

export default SessionCard;
