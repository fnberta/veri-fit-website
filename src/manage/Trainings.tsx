import { RouteComponentProps } from '@reach/router';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Client, Session, Time, Training } from '../../shared';
import Button, { Buttons } from '../components/bulma/Button';
import { Title } from '../components/bulma/Heading';
import { Container, Section } from '../components/bulma/Page';
import WeekSchedule, { TimeOfDay, Weekday, WeekdayEntry } from '../components/WeekSchedule';
import AddEditTrainingDialog from './AddEditTrainingDialog';
import EditParticipantsDialog from './EditParticipantsDialog';
import { useRepos } from './repositories/RepoContext';
import SessionCard from './SessionCard';

export type Props = RouteComponentProps;

type Week = Record<Weekday, WeekdayEntry[]>;

type TrainingDialog = { type: 'ADD' } | { type: 'EDIT'; training: Training };

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

const Trainings: React.FC<Props> = () => {
  const [date, setDate] = useState(() => DateTime.local());
  const [trainingDialog, setTrainingDialog] = useState<TrainingDialog>();
  const [editSessionParticipants, setEditSessionParticipants] = useState<Session>();
  const [clients, setClients] = useState([] as Client[]);
  const [sessions, setSessions] = useState([] as Session[]);
  const { clientRepo, sessionRepo } = useRepos();

  useEffect(() => clientRepo.observeAll(setClients), [clientRepo]);
  useEffect(() => sessionRepo.observeAllForWeek(date.weekYear, date.weekNumber, setSessions), [sessionRepo, date]);
  useEffect(() => {
    sessionRepo.createForWeek(date.weekYear, date.weekNumber).catch(err => console.error(err));
  }, [sessionRepo, date]);

  return (
    <Section>
      <Container>
        <Title size={1}>Trainings</Title>
        <Button
          className="block"
          text="Hinzufügen"
          icon="fa-plus"
          intent="primary"
          onClick={() => setTrainingDialog({ type: 'ADD' })}
        />
        <Buttons>
          <Button text="Previous" onClick={() => setDate(prev => prev.minus({ weeks: 1 }))} />
          <Button text="Current" onClick={() => setDate(DateTime.local())} />
          <Button text="Next" onClick={() => setDate(prev => prev.plus({ weeks: 1 }))} />
        </Buttons>
        <Title size={4}>{`Woche ${date.weekNumber}`}</Title>
        <WeekSchedule
          {...sessions.reduce<Week>(
            (acc, curr) => {
              const weekday = mapNumericWeekday(DateTime.fromISO(curr.date).weekday);
              acc[weekday].push({
                id: curr.id,
                weekday,
                timeOfDay: getTimeOfDay(curr.time),
                content: (
                  <SessionCard
                    session={curr}
                    clients={clients}
                    onConfirmToggle={() => sessionRepo.update({ ...curr, confirmed: !curr.confirmed })}
                    onEditParticipantsClick={() => setEditSessionParticipants(curr)}
                    onEditTrainingClick={training => setTrainingDialog({ type: 'EDIT', training })}
                  />
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
        {trainingDialog?.type === 'ADD' && (
          <AddEditTrainingDialog
            clients={clients}
            onTrainingChanged={() => {
              setTrainingDialog(undefined);
              sessionRepo.createForWeek(date.weekYear, date.weekNumber).catch(err => console.error(err));
            }}
            onCancelClick={() => setTrainingDialog(undefined)}
          />
        )}
        {trainingDialog?.type === 'EDIT' && (
          <AddEditTrainingDialog
            training={trainingDialog.training}
            clients={clients}
            onTrainingChanged={() => {
              setTrainingDialog(undefined);
              sessionRepo.createForWeek(date.weekYear, date.weekNumber).catch(err => console.error(err));
            }}
            onCancelClick={() => setTrainingDialog(undefined)}
          />
        )}
        {editSessionParticipants && (
          <EditParticipantsDialog
            session={editSessionParticipants}
            clients={clients}
            onSessionUpdated={() => setEditSessionParticipants(undefined)}
            onCancelClick={() => setEditSessionParticipants(undefined)}
          />
        )}
      </Container>
    </Section>
  );
};

export default Trainings;
