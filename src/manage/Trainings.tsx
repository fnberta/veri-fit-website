import { RouteComponentProps } from '@reach/router';
import { Link } from 'gatsby';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Client, Session, Time } from '../../shared';
import Button, { Buttons } from '../components/bulma/Button';
import { Title } from '../components/bulma/Heading';
import { Container, Section } from '../components/bulma/Page';
import WeekSchedule, { TimeOfDay, Weekday, WeekdayEntry } from '../components/WeekSchedule';
import AddTrainingDialog from './AddTrainingDialog';
import EditSessionDialog from './EditSessionDialog';
import { useRepos } from './repositories/RepoContext';
import SessionCard from './SessionCard';

export type Props = RouteComponentProps<{ year: number; week: number }>;

type Week = Record<Weekday, WeekdayEntry[]>;

type AddEditDialog = { type: 'ADD' } | { type: 'EDIT'; session: Session };

function getWeekday(iso: string): Weekday {
  const date = DateTime.fromISO(iso);
  switch (date.weekday) {
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
      throw new Error(`invalid weekday number: ${date.weekday}`);
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

const getNextPath = (date: DateTime) => `/manage/trainings/${date.weekYear}/${date.weekNumber}`;

function getDateFromPath(year: number | undefined, week: number | undefined): DateTime {
  if (year == null || week == null) {
    return DateTime.local();
  } else {
    return DateTime.fromObject({ weekYear: year, weekNumber: week });
  }
}

const Trainings: React.FC<Props> = ({ year, week }) => {
  const [addEditDialog, setAddEditDialog] = useState<AddEditDialog>();
  const [clients, setClients] = useState([] as Client[]);
  const [sessions, setSessions] = useState([] as Session[]);
  const { clientRepo, sessionRepo } = useRepos();

  const date = getDateFromPath(year, week);

  useEffect(() => clientRepo.observeAll(setClients), [clientRepo]);
  useEffect(() => sessionRepo.observeAllForWeek(date.weekYear, date.weekNumber, setSessions), [
    sessionRepo,
    date.weekYear,
    date.weekNumber,
  ]);
  useEffect(() => {
    // TODO: show error to user
    sessionRepo.createForYear(date.weekYear).catch(err => console.error(err));
  }, [sessionRepo, date.weekYear]);

  return (
    <Section>
      <Container>
        <Title size={1}>Trainings</Title>
        <Button
          className="block"
          text="Hinzufügen"
          icon="fa-plus"
          intent="primary"
          onClick={() => setAddEditDialog({ type: 'ADD' })}
        />
        <Buttons>
          <Link className="button" to={getNextPath(date.minus({ weeks: 1 }))}>
            Vorherige
          </Link>
          <Link className="button" to={getNextPath(DateTime.local())}>
            Jetzt
          </Link>
          <Link className="button" to={getNextPath(date.plus({ weeks: 1 }))}>
            Nächste
          </Link>
        </Buttons>
        <Title size={4}>{`Woche ${date.weekNumber}`}</Title>
        <WeekSchedule
          {...sessions.reduce<Week>(
            (acc, curr) => {
              const weekday = getWeekday(curr.runsFrom);
              acc[weekday].push({
                id: curr.id,
                weekday,
                timeOfDay: getTimeOfDay(curr.time),
                content: (
                  <SessionCard
                    session={curr}
                    clients={clients}
                    onConfirmToggle={() => sessionRepo.toggleConfirmed(curr)}
                    onEditClick={() => setAddEditDialog({ type: 'EDIT', session: curr })}
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
        {addEditDialog?.type === 'ADD' && (
          <AddTrainingDialog
            clients={clients}
            onTrainingCreated={() => setAddEditDialog(undefined)}
            onCancelClick={() => setAddEditDialog(undefined)}
          />
        )}
        {addEditDialog?.type === 'EDIT' && (
          <EditSessionDialog
            session={addEditDialog.session}
            clients={clients}
            onSessionChanged={() => setAddEditDialog(undefined)}
            onCancelClick={() => setAddEditDialog(undefined)}
          />
        )}
      </Container>
    </Section>
  );
};

export default Trainings;
