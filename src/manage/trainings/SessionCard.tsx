import React from 'react';
import { Client, Session } from '../../../shared';
import { getToday } from '../dateTime';
import { getTrainingName } from '../displayNames';
import { showSessionConfirm } from '../subscriptionChecks';
import { Button } from '../../common/components/Button';

export interface Props {
  session: Session;
  clients: Client[];
  onConfirmToggle: React.MouseEventHandler;
  onEditClick: React.MouseEventHandler;
}

const SessionCard: React.FC<Props> = ({ session, clients, onConfirmToggle, onEditClick }) => (
  <div className="bg-white rounded overflow-hidden border">
    <div className="px-4 py-2 flex flex-col items-start">
      <div className="flex flex-col items-start">
        <h5 className="text-xs text-gray-600 uppercase tracking-wider font-semibold">{`${session.time.start} - ${session.time.end}`}</h5>
        <h4 className="text-lg font-semibold leading-tight">{getTrainingName(session.type)}</h4>
      </div>
      <p className="mt-2 text-gray-600 text-sm">{`${session.clientIds.length} Teilnehmer`}</p>
    </div>
    <footer className="flex items-center justify-end bg-gray-100 px-4 py-2">
      {!session.confirmed && (
        <Button size="small" onClick={onEditClick}>
          Bearbeiten
        </Button>
      )}
      {session.date <= getToday() &&
        (session.confirmed ? (
          <Button className="ml-2" size="small" onClick={onConfirmToggle}>
            Öffnen
          </Button>
        ) : (
          <Button
            className="ml-2"
            size="small"
            color="orange"
            disabled={!showSessionConfirm(clients, session)}
            onClick={onConfirmToggle}
          >
            Bestätigen
          </Button>
        ))}
    </footer>
  </div>
);

export default SessionCard;
