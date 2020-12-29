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
import { Client, Subscription } from '@veri-fit/common';
import { Button, IconButton, Input } from '@veri-fit/common-ui';
import Dialog from '../Dialog';
import { useRepos } from '../repositories/RepoContext';
import { ActiveSubscriptionTag, ActiveSubscriptionTags, getActiveSubscriptionTags } from '../subscriptionChecks';
import Navbar from '../Navbar';
import Tag, { TagColor } from '../Tag';
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
      label="Kunde hinzufügen"
      onClick={onAddUserClick}
    />
  </div>
);

interface ClientTag {
  text: string;
  color: TagColor;
}

function getClientTags(activeSubscriptions: Subscription[]): ClientTag[] {
  const clientTags = [] as ClientTag[];

  if (activeSubscriptions.length === 0) {
    clientTags.push({
      text: 'Kein aktives Abo',
      color: 'gray',
    });
  } else {
    const initial: ActiveSubscriptionTags = {
      expired: false,
      expiring: false,
      runsShort: false,
      unpaid: false,
    };
    const tags = activeSubscriptions.reduce((acc, curr) => {
      const tags = getActiveSubscriptionTags(curr);
      for (const [key, value] of Object.entries(tags)) {
        if (value) {
          acc[key as ActiveSubscriptionTag] = true;
        }
      }
      return acc;
    }, initial);
    if (tags.unpaid) {
      clientTags.push({
        text: 'Unbezahlt',
        color: 'red',
      });
    }
    if (tags.expired) {
      clientTags.push({
        text: 'Abgelaufen',
        color: 'orange',
      });
    }
    if (tags.expiring) {
      clientTags.push({
        text: 'Läuft ab',
        color: 'blue',
      });
    }
    if (tags.runsShort) {
      clientTags.push({
        text: 'Wird knapp',
        color: 'blue',
      });
    }
  }

  return clientTags;
}

interface ClientListProps extends ComponentPropsWithoutRef<'ul'> {
  clients: Client[];
  selectedClientId: string | undefined;
}

const ClientList: FC<ClientListProps> = ({ clients, selectedClientId, className, ...rest }) => (
  <ul className={cx('divide-y', className)} {...rest}>
    {clients.map(({ id, name, activeSubscriptions }) => {
      const tags = getClientTags(activeSubscriptions);
      return (
        <li key={id} className={cx('hover:bg-gray-200', selectedClientId === id && 'bg-gray-300')}>
          <Link className="block p-4 sm:px-6" to={selectedClientId === id ? '/clients' : `/clients/${id}`}>
            <h2 className="text-xl">{name}</h2>
            {tags.length > 0 && (
              <div className="-ml-1 mt-1">
                {tags.map((tag) => (
                  <Tag key={tag.text} className="ml-1 mt-1" color={tag.color}>
                    {tag.text}
                  </Tag>
                ))}
              </div>
            )}
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
      <Navbar className="flex-shrink-0" />
      <section className="flex-auto flex bg-gray-100 min-h-0">
        {header}
        {!clients ? null : clients.length === 0 ? (
          empty
        ) : (
          <div className="flex-auto p-6 max-w-screen-xl mx-auto min-h-0 flex flex-col space-y-6">
            <SearchHeader
              className="flex-shrink-0"
              filterQuery={filterQuery}
              onFilterQueryChange={(e) => setFilterQuery(e.currentTarget.value)}
              onAddUserClick={onAddUserClick}
            />
            {filteredClients.length === 0 ? (
              emptySearch
            ) : (
              <div className="flex-auto min-h-0 flex space-x-6">
                <ClientList
                  style={{ width: '22rem' }}
                  className="bg-white shadow rounded overflow-auto"
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
          <Navbar className="flex-shrink-0" upTarget="/clients" />
          <ClientDetails className="flex-auto overflow-auto" client={selectedClient} />
        </>
      ) : (
        <>
          <Navbar className="flex-shrink-0" />
          <section className="flex-auto overflow-auto flex flex-col bg-gray-100">
            {header}
            {!clients ? null : clients.length === 0 ? (
              empty
            ) : (
              <div className="flex-auto flex flex-col">
                <SearchHeader
                  className="p-4 sm:p-6 flex-shrink-0"
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
  const handleDialogClose = () => setAddDialogOpen(false);
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
      <Dialog open={addDialogOpen} onCancel={handleDialogClose}>
        <AddClientDialogContent onClientCreated={handleDialogClose} onCancelClick={handleDialogClose} />
      </Dialog>
    </>
  );
};

export default Clients;
