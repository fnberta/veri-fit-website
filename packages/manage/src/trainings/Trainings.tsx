import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Client, Session, Time } from '@veri-fit/common';
import { Button, TimeOfDay, Week, Weekday, WeekSchedule } from '@veri-fit/common-ui';
import { useParams } from 'react-router-dom';
import Dialog from '../Dialog';
import { useRepos } from '../repositories/RepoContext';
import { LinkIconButton } from '../LinkButton';
import AddSessionDialogContent from './AddSessionDialogContent';
import AddTrainingDialogContent from './AddTrainingDialogContent';
import EditSessionDialogContent from './EditSessionDialogContent';
import SessionCard from './SessionCard';

export type Props = React.ComponentPropsWithoutRef<'section'>;

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

const getNextPath = (date: DateTime) => `/trainings/${date.weekYear}/${date.weekNumber}`;

function getDateFromPath(year: string | undefined, week: string | undefined): DateTime {
  if (year == null || week == null) {
    return DateTime.local();
  } else {
    return DateTime.fromObject({ weekYear: +year, weekNumber: +week });
  }
}

const Trainings: React.FC<Props> = ({ className, ...rest }) => {
  const [addEditDialog, setAddEditDialog] = useState<AddEditDialog>();
  const [clients, setClients] = useState([] as Client[]);
  const [sessions, setSessions] = useState([] as Session[]);
  const { clientRepo, sessionRepo } = useRepos();

  const { year, week } = useParams<{ year?: string; week?: string }>();
  const date = getDateFromPath(year, week);

  useEffect(() => clientRepo.observeAll(setClients), [clientRepo]);
  useEffect(() => sessionRepo.observeAllForWeek(date.weekYear, date.weekNumber, setSessions), [
    sessionRepo,
    date.weekYear,
    date.weekNumber,
  ]);
  useEffect(() => {
    sessionRepo.createForYear(date.weekYear).catch((err) => {
      // TODO: show error to user
      // eslint-disable-next-line no-console
      console.error(err);
    });
  }, [sessionRepo, date.weekYear]);

  return (
    <section className={cx('bg-gray-100 overflow-auto', className)} {...rest}>
      <div className="w-full max-w-screen-xl mx-auto py-6 px-4 space-y-4">
        <div className="flex justify-between items-center space-x-2">
          <header>
            <h1 className="sr-only">Trainings</h1>
            <h2 className="text-xl md:text-2xl font-semibold">{`Woche ${date.weekNumber}`}</h2>
            <p className="text-xs md:text-sm">{`${date.set({ weekday: 1 }).toLocaleString()} - ${date
              .set({ weekday: 7 })
              .toLocaleString()}`}</p>
          </header>
          <div className="button-group">
            <LinkIconButton
              icon="arrow-left"
              shape="outlined"
              label="Vorherige Woche"
              to={getNextPath(date.minus({ weeks: 1 }))}
            />
            <LinkIconButton icon="calendar" shape="outlined" label="Diese Woche" to={getNextPath(DateTime.local())} />
            <LinkIconButton
              icon="arrow-right"
              shape="outlined"
              label="Nächste Woche"
              to={getNextPath(date.plus({ weeks: 1 }))}
            />
          </div>
        </div>
        <WeekSchedule
          className="p-4 bg-white rounded shadow"
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
        <div className="flex space-x-2">
          <Button icon="document-add" onClick={() => setAddEditDialog({ type: 'ADD_TRAINING' })}>
            Neue Trainingsreihe
          </Button>
          <Button icon="plus" onClick={() => setAddEditDialog({ type: 'ADD_SESSION' })}>
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
