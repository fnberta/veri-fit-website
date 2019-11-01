import styled from '@emotion/styled';
import { RouteComponentProps } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { User } from '../../shared/interfaces';
import Button from '../components/bulma/Button';
import Card from '../components/bulma/Card';
import { Title } from '../components/bulma/Heading';
import { Container, Section } from '../components/bulma/Page';
import { Tag, Tags } from '../components/bulma/Tags';
import AddUserDialog from '../manage/AddUserDialog';
import { useRepos } from './RepoContext';
import UserDetails from './UserDetails';

export type Props = RouteComponentProps;

const Grid = styled.div({
  display: 'grid',
  gridGap: '1.5rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
});

const UserCard = styled(Card)({
  cursor: 'pointer',
});

const Users: React.FC<Props> = () => {
  const [users, setUsers] = useState([] as User[]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string>();
  const { userRepo } = useRepos();

  useEffect(() => userRepo.observeAll(setUsers), [userRepo]);

  return (
    <Section>
      <Container>
        <Title size={1}>Teilnehmer verwalten</Title>
        <Button
          className="block"
          text="Hinzufügen"
          icon="fa-plus"
          intent="primary"
          onClick={() => setAddModalOpen(true)}
        />
        <Grid>
          {users.map(user => {
            if (activeUserId === user.id) {
              return <UserDetails key={user.id} user={user} onCloseClick={() => setActiveUserId(undefined)} />;
            }

            const { name, subscriptions } = user;
            return (
              <UserCard key={user.id} onClick={() => setActiveUserId(user.id)}>
                <Title size={4} text={name} />
                <Tags>
                  {subscriptions.unpaid && <Tag text="Unbezahlt" intent="danger" />}
                  {subscriptions.expires && <Tag text="Läuft ab" />}
                  {subscriptions.runsShort && <Tag text="Wird knapp" />}
                </Tags>
              </UserCard>
            );
          })}
        </Grid>
        {addModalOpen && (
          <AddUserDialog onUserCreated={() => setAddModalOpen(false)} onCancelClick={() => setAddModalOpen(false)} />
        )}
      </Container>
    </Section>
  );
};

export default Users;
