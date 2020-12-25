import { Link, useParams } from 'react-router-dom';
import React, {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  FC,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cx from 'classnames';
import { Client } from '@veri-fit/common';
import { Button, IconButton, Input } from '@veri-fit/common-ui';
import Dialog from '../Dialog';
import { useRepos } from '../repositories/RepoContext';
import { doesSubscriptionRunShort, isSubscriptionExpiring } from '../subscriptionChecks';
import Navbar from '../Navbar';
import AddClientDialogContent from './AddClientDialogContent';
import ClientDetails from './ClientDetails';

interface SearchHeaderProps extends ComponentPropsWithoutRef<'div'> {
  filterQuery: string;
  onFilterQueryChange: ChangeEventHandler<HTMLInputElement>;
  onAddUserClick: MouseEventHandler;
}

const SearchHeader: FC<SearchHeaderProps> = ({
  filterQuery,
  onFilterQueryChange,
  onAddUserClick,
  className,
  ...rest
}) => (
  <div className={cx('flex items-center space-x-4', className)} {...rest}>
    <Input
      type="search"
      aria-label="Kundennamen"
      placeholder="Filtern…"
      value={filterQuery}
      onChange={onFilterQueryChange}
    />
    <IconButton
      className="flex-shrink-0"
      icon="user-add"
      shape="outlined"
      label="Hinzufügen"
      onClick={onAddUserClick}
    />
  </div>
);

interface ClientListProps extends ComponentPropsWithoutRef<'ul'> {
  clients: Client[];
  selectedClientId: string | undefined;
}

const ClientList: FC<ClientListProps> = ({ clients, selectedClientId, className, ...rest }) => (
  <ul className={className} {...rest}>
    {clients.map((client) => {
      const { name, activeSubscriptions } = client;
      const tags = [] as ReactNode[];
      if (activeSubscriptions.some((subscription) => subscription.paidAt == null)) {
        tags.push(
          <span key="unpaid" className="tag tag-red">
            Unbezahlt
          </span>,
        );
      }
      if (activeSubscriptions.some(isSubscriptionExpiring)) {
        tags.push(
          <span key="expires" className="tag tag-blue">
            Läuft ab
          </span>,
        );
      }
      if (activeSubscriptions.some(doesSubscriptionRunShort)) {
        tags.push(
          <span key="runs-short" className="tag tag-blue">
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
            className="block p-4 sm:px-6"
            to={selectedClientId === client.id ? '/clients' : `/clients/${client.id}`}
          >
            <h2 className="text-xl">{name}</h2>
            {tags.length > 0 && <div className="space-x-1">{tags}</div>}
          </Link>
        </li>
      );
    })}
  </ul>
);

function useFilteredClients(clients: Client[] | undefined) {
  const { clientId } = useParams<{ clientId?: string }>();
  const [filterQuery, setFilterQuery] = useState('');
  const selectedClient = clients?.find((client) => client.id === clientId);

  const filteredClients = useMemo(() => {
    if (!clients) {
      return [];
    } else if (filterQuery.length > 0) {
      const filterQueryLower = filterQuery.toLowerCase();
      return clients.filter((client) => client.name.toLowerCase().includes(filterQueryLower));
    } else {
      return clients;
    }
  }, [clients, filterQuery]);

  return {
    filterQuery,
    setFilterQuery,
    filteredClients,
    selectedClient,
  };
}

interface ClientsContentProps {
  clients?: Client[];
  header: ReactNode;
  empty: ReactNode;
  emptySearch: ReactNode;
  onAddUserClick: MouseEventHandler;
}

const ClientsDualPane: FC<ClientsContentProps> = ({ clients, header, empty, emptySearch, onAddUserClick }) => {
  const { filterQuery, setFilterQuery, filteredClients, selectedClient } = useFilteredClients(clients);
  return (
    <div className="flex-auto min-h-0 hidden lg:flex flex-col">
      <Navbar />
      <section className="flex-auto flex bg-gray-100 min-h-0">
        {header}
        {!clients ? null : clients.length === 0 ? (
          empty
        ) : (
          <div className="flex-auto p-6 max-w-screen-xl mx-auto min-h-0 flex flex-col space-y-6">
            <SearchHeader
              filterQuery={filterQuery}
              onFilterQueryChange={(e) => setFilterQuery(e.currentTarget.value)}
              onAddUserClick={onAddUserClick}
            />
            {filteredClients.length === 0 ? (
              emptySearch
            ) : (
              <div className="flex-auto min-h-0 flex space-x-6">
                <ClientList
                  className="w-1/5 bg-white shadow rounded overflow-auto"
                  clients={filteredClients}
                  selectedClientId={selectedClient?.id}
                />
                {selectedClient ? (
                  <ClientDetails className="flex-auto shadow rounded overflow-auto bg-white" client={selectedClient} />
                ) : (
                  <div className="flex-auto flex flex-col items-center justify-center">
                    <p className="text-lg text-center">Wähle einen Kunden aus um Details zu sehen.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const ClientsSinglePane: FC<ClientsContentProps> = ({ clients, header, empty, emptySearch, onAddUserClick }) => {
  const { filterQuery, setFilterQuery, filteredClients, selectedClient } = useFilteredClients(clients);
  return (
    <div className="flex-auto min-h-0 flex flex-col lg:hidden">
      {selectedClient ? (
        <>
          <Navbar upTarget="/clients" />
          <ClientDetails className="flex-auto overflow-auto" client={selectedClient} />
        </>
      ) : (
        <>
          <Navbar />
          <section className="flex-auto overflow-auto flex flex-col bg-gray-100">
            {header}
            {!clients ? null : clients.length === 0 ? (
              empty
            ) : (
              <div className="flex-auto flex flex-col">
                <SearchHeader
                  className="p-4 sm:p-6"
                  filterQuery={filterQuery}
                  onFilterQueryChange={(e) => setFilterQuery(e.currentTarget.value)}
                  onAddUserClick={onAddUserClick}
                />
                {filteredClients.length === 0 ? (
                  emptySearch
                ) : (
                  <ClientList
                    className="flex-auto bg-white shadow"
                    clients={filteredClients}
                    selectedClientId={undefined}
                  />
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export type Props = ComponentPropsWithoutRef<'section'>;

const Clients: FC = () => {
  const [clients, setClients] = useState<Client[]>();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { clientRepo } = useRepos();

  useEffect(() => clientRepo.observeAll(setClients), [clientRepo]);

  const handleAddUserClick = () => setAddDialogOpen(true);
  const header = (
    <header className="sr-only">
      <h1>Kunden</h1>
    </header>
  );
  const empty = (
    <div className="flex-auto p-4 flex flex-col items-center justify-center space-y-4">
      <p className="text-xl text-center">Starte dein Business und füge einen Kunden hinzu.</p>
      <Button size="lg" colorScheme="orange" icon="user-add" onClick={handleAddUserClick}>
        Hinzufügen
      </Button>
    </div>
  );
  const emptySearch = (
    <div className="flex-auto flex items-center justify-center">
      <p className="text-lg text-center">Keine Kunden gefunden…</p>
    </div>
  );
  return (
    <>
      <ClientsSinglePane
        clients={clients}
        header={header}
        empty={empty}
        emptySearch={emptySearch}
        onAddUserClick={handleAddUserClick}
      />
      <ClientsDualPane
        clients={clients}
        header={header}
        empty={empty}
        emptySearch={emptySearch}
        onAddUserClick={handleAddUserClick}
      />
      <Dialog open={addDialogOpen} onCancel={() => setAddDialogOpen(false)}>
        <AddClientDialogContent
          onClientCreated={() => setAddDialogOpen(false)}
          onCancelClick={() => setAddDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default Clients;
