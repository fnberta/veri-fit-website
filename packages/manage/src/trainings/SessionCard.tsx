import React, { FC, MouseEventHandler, useState } from 'react';
import { Link } from 'react-router-dom';
import { Client, Session } from '@veri-fit/common';
import { Button } from '@veri-fit/common-ui';
import { getToday } from '../dateTime';
import { getTrainingName } from '../displayNames';
import { getClientsWithIssues } from '../subscriptionChecks';
import { useRepos } from '../repositories/RepoContext';

export interface Props {
  session: Session;
  clients: Client[];
  onEditClick: MouseEventHandler;
}

const SessionCard: FC<Props> = ({ session, clients, onEditClick }) => {
  const [loading, setLoading] = useState(false);
  const { sessionRepo } = useRepos();

  async function handleToggleClick() {
    setLoading(true);
    try {
      await sessionRepo.toggleConfirmed(session.id);
    } catch (e) {
      // TODO: show error to user
      // eslint-disable-next-line no-console
      console.error('toggling confirmed status of session failed with', e);
    }
    setLoading(false);
  }

  const clientsWithIssues = getClientsWithIssues(clients, session);
  const hasClientsWithIssues = clientsWithIssues.length > 0;
  return (
    <div className="bg-white rounded overflow-hidden border">
      <div className="px-4 py-2 flex flex-col items-start space-y-2">
        <div className="flex flex-col items-start">
          <h5 className="text-xs text-gray-600 uppercase tracking-wider font-semibold">{`${session.time.start} - ${session.time.end}`}</h5>
          <h4 className="text-lg font-semibold leading-tight">{getTrainingName(session.type)}</h4>
        </div>
        <p className=" text-sm text-gray-600">{`${session.clientIds.length} Teilnehmer`}</p>
        {hasClientsWithIssues && (
          <div className="text-xs text-red-600 space-y-1">
            <p>Kein gültiges Abo:</p>
            <ul className="list-disc list-inside">
              {clientsWithIssues.map((client) => (
                <li key={client.id}>
                  <Link className="font-medium" to={`/clients/${client.id}`}>
                    {client.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <footer className="flex items-center justify-end bg-gray-100 px-4 py-2 space-x-2">
        {!session.confirmed && (
          <Button shape="outlined" size="sm" disabled={loading} onClick={onEditClick}>
            Bearbeiten
          </Button>
        )}
        {session.date <= getToday() &&
          (session.confirmed ? (
            <Button size="sm" loading={loading} onClick={handleToggleClick}>
              Öffnen
            </Button>
          ) : (
            <Button size="sm" loading={loading} disabled={hasClientsWithIssues} onClick={handleToggleClick}>
              Bestätigen
            </Button>
          ))}
      </footer>
    </div>
  );
};

export default SessionCard;
