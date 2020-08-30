import { RouteComponentProps } from '@reach/router';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Client, Session, Time } from '../../../shared';
import { Button, LinkIconButton } from '../../common/components/Button';
import Dialog from '../../common/components/Dialog';
import WeekSchedule, { TimeOfDay, Week, Weekday } from '../../common/components/WeekSchedule';
import { ClassNameProps } from '../../common/utils/types';
import { useRepos } from '../repositories/RepoContext';
import AddSessionDialogContent from './AddSessionDialogContent';
import AddTrainingDialogContent from './AddTrainingDialogContent';
import EditSessionDialogContent from './EditSessionDialogContent';
import SessionCard from './SessionCard';

export type Props = RouteComponentProps<{ year: number; week: number }> & ClassNameProps;

type AddEditDialog = { type: 'ADD_TRAINING' } | { type: 'ADD_SESSION' } | { type: 'EDIT'; session: Session };

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
    sessionRepo.createForYear(date.weekYear).catch((err) => console.error(err));
  }, [sessionRepo, date.weekYear]);

  return (
    <section className={cx('bg-gray-100 overflow-auto', className)}>
      <div className="w-full max-w-screen-xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <header>
            <h1 className="sr-only">Trainings</h1>
            <h2 className="text-xl md:text-2xl font-semibold">{`Woche ${date.weekNumber}`}</h2>
            <p className="text-xs md:text-sm">{`${date.set({ weekday: 1 }).toLocaleString()} - ${date
              .set({ weekday: 7 })
              .toLocaleString()}`}</p>
          </header>
          <div className="ml-2">
            <LinkIconButton
              className="rounded-none rounded-l"
              icon="arrow-left"
              shape="outlined"
              aria-label="Vorherige Woche"
              to={getNextPath(date.minus({ weeks: 1 }))}
            />
            <LinkIconButton
              className="relative rounded-none -ml-px"
              icon="calendar"
              shape="outlined"
              aria-label="Diese Woche"
              to={getNextPath(DateTime.local())}
            />
            <LinkIconButton
              className="rounded-none rounded-r -ml-px"
              icon="arrow-right"
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
        <div className="mt-4 flex">
          <Button icon="document-add" onClick={() => setAddEditDialog({ type: 'ADD_TRAINING' })}>
            Neue Trainingsreihe
          </Button>
          <Button className="ml-2" icon="plus" onClick={() => setAddEditDialog({ type: 'ADD_SESSION' })}>
            Neues Einzeltraining
          </Button>
        </div>
        <Dialog open={addEditDialog != null} onCancel={() => setAddEditDialog(undefined)}>
          {addEditDialog?.type === 'ADD_TRAINING' && (
            <AddTrainingDialogContent
              clients={clients}
              onTrainingCreated={() => setAddEditDialog(undefined)}
              onCancelClick={() => setAddEditDialog(undefined)}
            />
          )}
          {addEditDialog?.type === 'ADD_SESSION' && (
            <AddSessionDialogContent
              clients={clients}
              onSessionAdded={() => setAddEditDialog(undefined)}
              onCancelClick={() => setAddEditDialog(undefined)}
            />
          )}
          {addEditDialog?.type === 'EDIT' && (
            <EditSessionDialogContent
              session={addEditDialog.session}
              clients={clients}
              onSessionChanged={() => setAddEditDialog(undefined)}
              onCancelClick={() => setAddEditDialog(undefined)}
            />
          )}
        </Dialog>
      </div>
    </section>
  );
};

export default Trainings;
