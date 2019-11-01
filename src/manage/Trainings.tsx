import styled from '@emotion/styled';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import Button from '../components/bulma/Button';
import Card from '../components/bulma/Card';
import { Container, Section } from '../components/bulma/Page';
import { Subtitle, Title } from '../components/bulma/Heading';
import WeekSchedule, { TimeOfDay, Weekday, WeekdayEntry } from '../components/WeekSchedule';
import AddTrainingDialog from './AddTrainingDialog';
import { Session, Time } from '../../shared/interfaces';
import { useRepos } from './RepoContext';
import { RouteComponentProps } from '@reach/router';
import EditSessionDialog from './EditSessionDialog';

export type Props = RouteComponentProps;

type Week = Record<Weekday, WeekdayEntry[]>;

function mapNumericWeekday(weekday: number): Weekday {
  switch (weekday) {
    case 1:
      return 'monday';
    case 2:
      return 'tuesday';
    case 3:
      return 'wednesday';
    case 4:
      return 'thursday';
    case 5:
      return 'friday';
    case 6:
      return 'saturday';
    default:
      throw new Error('invalid');
  }
}

function getTimeOfDay(time: Time): TimeOfDay {
  const start = DateTime.fromISO(time.start);
  if (start.hour < 12) {
    return 'morning';
  }

  if (start.hour > 17) {
    return 'evening';
  }

  return 'midday';
}

const SessionCard = styled(Card)<{ confirmed: boolean }>(props => ({
  cursor: props.confirmed ? '' : 'pointer',
  backgroundColor: props.confirmed ? 'hsl(0, 0%, 71%)' : undefined,
}));

const Trainings: React.FC<Props> = () => {
  const { weekYear, weekNumber } = DateTime.local();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editSession, setEditSession] = useState<Session>();
  const [week, setWeek] = useState(weekNumber);
  const [sessions, setSessions] = useState([] as Session[]);
  const { sessionRepo } = useRepos();

  useEffect(() => sessionRepo.observeAllForWeek(weekYear, week, setSessions), [sessionRepo, weekYear, week]);
  useEffect(() => {
    sessionRepo.createForWeek(weekYear, week).catch(err => console.error(err));
  }, [sessionRepo, weekYear, week]);

  return (
    <Section>
      <Container>
        <Title size={1}>Trainings</Title>
        <Button
          className="block"
          text="Hinzufügen"
          icon="fa-plus"
          intent="primary"
          onClick={() => setAddModalOpen(true)}
        />
        <div className="buttons has-addons">
          <Button text="Previous" onClick={() => setWeek(prev => prev - 1)} />
          <Button text="Current" onClick={() => setWeek(weekNumber)} />
          <Button text="Next" onClick={() => setWeek(prev => prev + 1)} />
        </div>
        <div>{week}</div>
        <WeekSchedule
          {...sessions.reduce<Week>(
            (acc, curr) => {
              const weekday = mapNumericWeekday(DateTime.fromISO(curr.date).weekday);
              acc[weekday].push({
                id: curr.id,
                weekday,
                timeOfDay: getTimeOfDay(curr.time),
                content: (
                  <SessionCard confirmed={curr.confirmed} onClick={() => setEditSession(curr)}>
                    <Title text={curr.category} size={5} />
                    <Subtitle text={`${curr.time.start} - ${curr.time.end}`} size={6} />
                    <p>{`${curr.participants.length} Teilnehmer`}</p>
                  </SessionCard>
                ),
              });

              return acc;
            },
            {
              monday: [],
              tuesday: [],
              wednesday: [],
              thursday: [],
              friday: [],
              saturday: [],
            },
          )}
        />
        {addModalOpen && (
          <AddTrainingDialog
            onTrainingCreated={() => setAddModalOpen(false)}
            onCancelClick={() => setAddModalOpen(false)}
          />
        )}
        {editSession && (
          <EditSessionDialog
            session={editSession}
            onSessionUpdated={() => setEditSession(undefined)}
            onCancelClick={() => setEditSession(undefined)}
          />
        )}
      </Container>
    </Section>
  );
};

export default Trainings;
