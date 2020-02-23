import { Link, RouteComponentProps } from '@reach/router';
import React, { useEffect, useMemo, useState } from 'react';
import { Client } from '../../shared';
import { Button } from '../components/Button';
import AddClientDialog from './AddClientDialog';
import { useRepos } from './repositories/RepoContext';
import { doesSubscriptionRunShort, isSubscriptionExpiring } from './subscriptionChecks';
import ClientDetails from './ClientDetails';
import cx from 'classnames';

export type Props = RouteComponentProps<{ clientId?: string }>;

const Clients: React.FC<Props> = ({ clientId }) => {
  const [filter, setFilter] = useState('');
  const [clients, setClients] = useState([] as Client[]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { clientRepo } = useRepos();

  const filteredClients = useMemo(() => {
    if (filter.length > 0) {
      return clients.filter(client => client.name.toLowerCase().includes(filter.toLowerCase()));
    } else {
      return clients;
    }
  }, [clients, filter]);

  useEffect(() => clientRepo.observeAll(setClients), [clientRepo]);

  const selectedClient = clients.find(client => client.id === clientId);
  return (
    <div className="flex-auto container mx-auto py-6 px-4 flex flex-col min-h-0">
      <div className={cx(clientId && 'hidden', 'md:block')}>
        <div className="flex justify-between items-baseline">
          <h1 className="text-xl md:text-2xl font-semibold">Kunden</h1>
          <Button icon="fa-plus" onClick={() => setAddDialogOpen(true)}>
            Hinzufügen
          </Button>
        </div>
      </div>
      <Link className={cx(!clientId && 'hidden', 'md:hidden btn btn-medium self-end')} to="/manage/clients">
        <span className="fas fa-times" />
        Schliessen
      </Link>
      {filteredClients.length > 0 ? (
        <>
          <input
            className={cx(clientId && 'hidden', 'md:block', 'form-input w-full mt-4')}
            type="search"
            aria-label="Kundennamen"
            placeholder="Filtern…"
            value={filter}
            onChange={e => setFilter(e.currentTarget.value)}
          />
          <div className="flex-auto mt-4 flex min-h-0">
            <ul
              className={cx(
                clientId && 'hidden',
                'md:flex md:flex-col md:w-1/5 flex-auto md:flex-initial bg-white rounded shadow overflow-auto',
              )}
            >
              {filteredClients.map(client => {
                const { name, activeSubscriptions } = client;
                const tags = [] as React.ReactNode[];
                if (activeSubscriptions.some(subscription => subscription.paidAt == null)) {
                  tags.push(
                    <span key="unpaid" className="ml-1 tag tag-red">
                      Unbezahlt
                    </span>,
                  );
                }

                if (activeSubscriptions.some(isSubscriptionExpiring)) {
                  tags.push(
                    <span key="expires" className="ml-1 tag tag-blue">
                      Läuft ab
                    </span>,
                  );
                }
                if (activeSubscriptions.some(doesSubscriptionRunShort)) {
                  tags.push(
                    <span key="runs-short" className="ml-1 tag tag-blue">
                      Wird knapp
                    </span>,
                  );
                }

                return (
                  <li
                    key={client.id}
                    className={cx('border-b hover:bg-gray-200', clientId === client.id && 'bg-gray-300')}
                  >
                    <Link
                      className="block p-4"
                      to={clientId === client.id ? '/manage/clients' : `/manage/clients/${client.id}`}
                    >
                      <h2 className="text-xl">{name}</h2>
                      {tags.length > 0 && <div className="-ml-1">{tags}</div>}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div
              className={cx(!clientId && 'hidden', 'md:block flex-1 md:ml-4 p-4 bg-white rounded shadow overflow-auto')}
            >
              {selectedClient ? (
                <ClientDetails client={selectedClient} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div>
                    <span className="fas fa-user fa-5x" />
                  </div>
                  <p className="mt-4 text-lg text-center">Wähle einen Kunden aus um Details zu sehen.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-auto mt-4 flex flex-col items-center justify-center">
          <div>
            <span className="far fa-user fa-7x" />
          </div>
          <p className="mt-8 text-xl text-center">Starte dein Business und füge einen Kunden hinzu.</p>
          <Button className="mt-4" size="large" color="orange" icon="fa-plus" onClick={() => setAddDialogOpen(true)}>
            Hinzufügen
          </Button>
        </div>
      )}
      {addDialogOpen && (
        <AddClientDialog
          onClientCreated={() => setAddDialogOpen(false)}
          onCancelClick={() => setAddDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Clients;
