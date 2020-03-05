import { RouteComponentProps } from '@reach/router';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Client, Session, Time } from '../../shared';
import { Button, LinkIconButton } from '../components/Button';
import WeekSchedule, { TimeOfDay, Week, Weekday } from '../components/WeekSchedule';
import { ClassNameProps } from '../utils/types';
import AddTrainingDialog from './AddTrainingDialog';
import EditSessionDialog from './EditSessionDialog';
import { useRepos } from './repositories/RepoContext';
import SessionCard from './SessionCard';
import cx from 'classnames';

export type Props = RouteComponentProps<{ year: number; week: number }> & ClassNameProps;

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

const Trainings: React.FC<Props> = ({ year, week, className }) => {
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
    <section className={cx('bg-gray-100 overflow-auto', className)}>
      <div className="container mx-auto py-6 px-4">
        <h1 className="hidden">Trainings</h1>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">{`Woche ${date.weekNumber}`}</h2>
            <p className="text-xs md:text-sm">{`${date.set({ weekday: 1 }).toLocaleString()} - ${date
              .set({ weekday: 7 })
              .toLocaleString()}`}</p>
          </div>
          <div className="ml-2">
            <LinkIconButton
              className="rounded-none rounded-l"
              icon="fa-arrow-left"
              shape="outlined"
              aria-label="Vorherige Woche"
              to={getNextPath(date.minus({ weeks: 1 }))}
            />
            <LinkIconButton
              className="relative rounded-none -ml-px"
              icon="fa-calendar-day"
              shape="outlined"
              aria-label="Diese Woche"
              to={getNextPath(DateTime.local())}
            />
            <LinkIconButton
              className="rounded-none rounded-r -ml-px"
              icon="fa-arrow-right"
              shape="outlined"
              aria-label="Nächste Woche"
              to={getNextPath(date.plus({ weeks: 1 }))}
            />
          </div>
        </div>
        <WeekSchedule
          className="mt-4 p-4 bg-white rounded shadow"
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
        <Button className="mt-4" onClick={() => setAddEditDialog({ type: 'ADD' })}>
          Neues Training eröffnen
        </Button>
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
      </div>
    </section>
  );
};

export default Trainings;
