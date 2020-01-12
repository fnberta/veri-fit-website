import styled from '@emotion/styled';
import { Link, RouteComponentProps } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { Client } from '../../shared';
import Button from '../components/bulma/Button';
import Card from '../components/bulma/Card';
import { Title } from '../components/bulma/Heading';
import { Container, Section } from '../components/bulma/Page';
import { Tag, Tags } from '../components/bulma/Tags';
import AddClientDialog from './AddClientDialog';
import { useRepos } from './repositories/RepoContext';
import { doesSubscriptionRunShort, isSubscriptionExpiring } from './subscriptionChecks';
import ClientDetails from './ClientDetails';

export type Props = RouteComponentProps<{ clientId?: string }>;

const Grid = styled.div({
  display: 'grid',
  gridGap: '1.5rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
});

const ClientCard = styled(Card)({ cursor: 'pointer' });

const ClientEntry: React.FC<{ client: Client }> = ({ client }) => {
  const { name, activeSubscriptions } = client;
  const tags = [] as React.ReactNode[];
  if (activeSubscriptions.some(subscription => subscription.paidAt == null)) {
    tags.push(<Tag key="unpaid" text="Unbezahlt" intent="danger" />);
  }

  if (activeSubscriptions.some(isSubscriptionExpiring)) {
    tags.push(<Tag key="expires" text="Läuft ab" />);
  }
  if (activeSubscriptions.some(doesSubscriptionRunShort)) {
    tags.push(<Tag key="runs-short" text="Wird knapp" />);
  }

  return (
    <Link to={client.id}>
      <ClientCard>
        <Title size={4} text={name} />
        {tags.length > 0 && <Tags>{tags}</Tags>}
      </ClientCard>
    </Link>
  );
};

const Clients: React.FC<Props> = ({ clientId }) => {
  const [clients, setClients] = useState([] as Client[]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { clientRepo } = useRepos();

  useEffect(() => clientRepo.observeAll(setClients), [clientRepo]);

  return (
    <Section>
      <Container>
        <Title size={1}>Teilnehmer verwalten</Title>
        <Button
          className="block"
          text="Hinzufügen"
          icon="fa-plus"
          intent="primary"
          onClick={() => setAddDialogOpen(true)}
        />
        <Grid>
          {clients.map(client =>
            clientId === client.id ? (
              <ClientDetails key={client.id} client={client} />
            ) : (
              <ClientEntry key={client.id} client={client} />
            ),
          )}
        </Grid>
        {addDialogOpen && (
          <AddClientDialog
            onClientCreated={() => setAddDialogOpen(false)}
            onCancelClick={() => setAddDialogOpen(false)}
          />
        )}
      </Container>
    </Section>
  );
};

export default Clients;
