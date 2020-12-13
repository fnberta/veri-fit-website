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
import AddClientDialogContent from './AddClientDialogContent';
import ClientDetails from './ClientDetails';

interface SearchHeaderProps extends ComponentPropsWithoutRef<'div'> {
  filterQuery: string;
  onFilterQueryChange: ChangeEventHandler;
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
    <IconButton icon="user-add" shape="outlined" label="Hinzufügen" onClick={onAddUserClick} />
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
            className="block p-4 md:px-6"
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

const NoClientsFound: FC<ComponentPropsWithoutRef<'div'>> = ({ className, ...rest }) => (
  <div className={cx('flex items-center justify-center', className)} {...rest}>
    <p className="text-lg text-center">Keine Kunden gefunden…</p>
  </div>
);

interface ClientsContentProps extends ComponentPropsWithoutRef<'div'> {
  clients: Client[];
  selectedClient: Client | undefined;
  header: ReactNode;
}

const ClientsDesktop: FC<ClientsContentProps> = ({ clients, selectedClient, header, className, ...rest }) => (
  <div className={cx('flex-auto p-6 min-h-0 hidden lg:flex flex-col space-y-6', className)} {...rest}>
    {header}
    <div className="flex-auto min-h-0 flex space-x-6">
      {clients.length === 0 ? (
        <NoClientsFound className="flex-auto" />
      ) : (
        <>
          <ClientList
            className="w-1/5 bg-white shadow rounded overflow-auto"
            clients={clients}
            selectedClientId={selectedClient?.id}
          />
          <div className="flex-1 flex bg-white shadow rounded overflow-auto">
            {selectedClient ? (
              <ClientDetails className="p-6 " client={selectedClient} />
            ) : (
              <div className="flex-auto flex flex-col items-center justify-center">
                <p className="text-lg text-center">Wähle einen Kunden aus um Details zu sehen.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  </div>
);

const ClientsMobile: FC<ClientsContentProps> = ({ clients, selectedClient, header, className, ...rest }) => (
  <div className={cx('lg:hidden flex-auto flex flex-col', className)} {...rest}>
    {selectedClient ? (
      <ClientDetails className="flex-auto p-4 md:p-6 bg-white" client={selectedClient} />
    ) : (
      <>
        {header}
        {clients.length === 0 ? (
          <NoClientsFound className="flex-auto" />
        ) : (
          <ClientList className="flex-auto bg-white shadow" clients={clients} selectedClientId={undefined} />
        )}
      </>
    )}
  </div>
);

export type Props = ComponentPropsWithoutRef<'section'>;

const Clients: FC<Props> = ({ className, ...rest }) => {
  const [clients, setClients] = useState<Client[]>();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const { clientRepo } = useRepos();
  const { clientId } = useParams<{ clientId?: string }>();
  const selectedClient = clients?.find((client) => client.id === clientId);

  useEffect(() => clientRepo.observeAll(setClients), [clientRepo]);

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

  const handleAddUserClick = () => setAddDialogOpen(true);
  const handleFilterQueryChange: ChangeEventHandler<HTMLInputElement> = (e) => setFilterQuery(e.currentTarget.value);

  return (
    <section className={cx('flex bg-gray-100 overflow-auto lg:overflow:hidden', className)} {...rest}>
      <header className="sr-only">
        <h1>Kunden</h1>
      </header>
      {clients ? (
        clients.length === 0 ? (
          <div className="flex-auto flex flex-col items-center justify-center space-y-4">
            <p className="text-xl text-center">Starte dein Business und füge einen Kunden hinzu.</p>
            <Button size="lg" colorScheme="orange" icon="user-add" onClick={() => setAddDialogOpen(true)}>
              Hinzufügen
            </Button>
          </div>
        ) : (
          <>
            <ClientsMobile
              clients={filteredClients}
              selectedClient={selectedClient}
              header={
                <SearchHeader
                  className="p-4 md:p-6"
                  filterQuery={filterQuery}
                  onFilterQueryChange={handleFilterQueryChange}
                  onAddUserClick={handleAddUserClick}
                />
              }
            />
            <ClientsDesktop
              clients={filteredClients}
              selectedClient={selectedClient}
              header={
                <SearchHeader
                  filterQuery={filterQuery}
                  onFilterQueryChange={handleFilterQueryChange}
                  onAddUserClick={handleAddUserClick}
                />
              }
            />
          </>
        )
      ) : null}
      <Dialog open={addDialogOpen} onCancel={() => setAddDialogOpen(false)}>
        <AddClientDialogContent
          onClientCreated={() => setAddDialogOpen(false)}
          onCancelClick={() => setAddDialogOpen(false)}
        />
      </Dialog>
    </section>
  );
};

export default Clients;
