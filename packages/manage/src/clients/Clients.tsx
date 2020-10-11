import { Link, useParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { Client } from '@veri-fit/common';
import { Button, ClassNameProps } from '@veri-fit/common-ui';
import Dialog from '../Dialog';
import { useRepos } from '../repositories/RepoContext';
import { doesSubscriptionRunShort, isSubscriptionExpiring } from '../subscriptionChecks';
import { LinkButton } from '../LinkButton';
import AddClientDialogContent from './AddClientDialogContent';
import ClientDetails from './ClientDetails';

const ClientsContent: React.FC<{
  clients: Client[];
  selectedClientId?: string;
  onAddUserClick: React.MouseEventHandler;
}> = ({ clients, selectedClientId, onAddUserClick }) => {
  const [filter, setFilter] = useState('');

  const filteredClients = useMemo(() => {
    if (filter.length > 0) {
      return clients.filter((client) => client.name.toLowerCase().includes(filter.toLowerCase()));
    } else {
      return clients;
    }
  }, [clients, filter]);

  const selectedClient = clients.find((client) => client.id === selectedClientId);
  const hasClients = clients.length > 0;
  return (
    <>
      <LinkButton className={cx(!selectedClient && 'hidden', 'lg:hidden self-start')} to="/clients" icon="arrow-left">
        Zurück
      </LinkButton>
      {hasClients ? (
        <>
          <input
            className={cx(selectedClient && 'hidden', 'lg:block', 'form-input w-full mt-4')}
            type="search"
            aria-label="Kundennamen"
            placeholder="Filtern…"
            value={filter}
            onChange={(e) => setFilter(e.currentTarget.value)}
          />
          {filteredClients.length > 0 ? (
            <>
              <div className="flex-auto mt-4 flex min-h-0">
                <ul
                  className={cx(
                    selectedClient && 'hidden',
                    'lg:w-1/5 flex-auto lg:flex-initial lg:flex lg:flex-col bg-white rounded shadow overflow-auto',
                  )}
                >
                  {filteredClients.map((client) => {
                    const { name, activeSubscriptions } = client;
                    const tags = [] as React.ReactNode[];
                    if (activeSubscriptions.some((subscription) => subscription.paidAt == null)) {
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
                        className={cx('border-b hover:bg-gray-200', selectedClientId === client.id && 'bg-gray-300')}
                      >
                        <Link
                          className="block p-4"
                          to={selectedClientId === client.id ? '/clients' : `/clients/${client.id}`}
                        >
                          <h2 className="text-xl">{name}</h2>
                          {tags.length > 0 && <div className="-ml-1">{tags}</div>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div
                  className={cx(
                    !selectedClient && 'hidden',
                    'lg:block flex-1 lg:ml-4 p-4 bg-white rounded shadow overflow-auto',
                  )}
                >
                  {selectedClient ? (
                    <ClientDetails client={selectedClient} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <p className="mt-4 text-lg text-center">Wähle einen Kunden aus um Details zu sehen.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-auto mt-4 flex flex-col items-center justify-center">
              <p className="mt-8 text-xl text-center">Keine Kunden gefunden…</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex-auto mt-4 flex flex-col items-center justify-center">
          <div>
            <span className="far fa-user fa-7x" />
          </div>
          <p className="mt-8 text-xl text-center">Starte dein Business und füge einen Kunden hinzu.</p>
          <Button className="mt-4" size="large" color="orange" icon="user-add" onClick={onAddUserClick}>
            Hinzufügen
          </Button>
        </div>
      )}
    </>
  );
};

const Clients: React.FC<ClassNameProps> = ({ className }) => {
  const [clients, setClients] = useState<Client[]>();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { clientRepo } = useRepos();

  useEffect(() => clientRepo.observeAll(setClients), [clientRepo]);

  const { clientId } = useParams<{ clientId?: string }>();
  return (
    <section className={cx('flex bg-gray-100 min-h-0', className)}>
      <div className="w-full max-w-screen-xl mx-auto py-6 px-4 flex flex-col">
        <header className={cx(clientId ? 'hidden' : 'flex', 'flex-shrink-0 lg:flex justify-between items-baseline')}>
          <h1 className="text-2xl font-semibold">Kunden</h1>
          <Button icon="user-add" onClick={() => setAddDialogOpen(true)}>
            Hinzufügen
          </Button>
        </header>
        {clients && (
          <ClientsContent clients={clients} selectedClientId={clientId} onAddUserClick={() => setAddDialogOpen(true)} />
        )}
        <Dialog open={addDialogOpen} onCancel={() => setAddDialogOpen(false)}>
          <AddClientDialogContent
            onClientCreated={() => setAddDialogOpen(false)}
            onCancelClick={() => setAddDialogOpen(false)}
          />
        </Dialog>
      </div>
    </section>
  );
};

export default Clients;
