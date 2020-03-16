import { Form, Formik, FormikHelpers } from 'formik';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { ChangeType, Client, Session, SessionInput, TrainingInput } from '../../shared';
import { Button } from '../common/components/Button';
import { DialogBody, DialogFooter, DialogHeader } from '../common/components/Dialog';
import { useRepos } from './repositories/RepoContext';
import SessionFormFields from './SessionFormFields';
import { validateTrainingForm } from './TrainingFormFields';

export interface Props {
  session: Session;
  clients: Client[];
  onSessionChanged: (session: Session) => void;
  onCancelClick: () => void;
}

interface FormValues extends TrainingInput {
  notes: string;
}

function getSessionInput(session: Session, values: FormValues): SessionInput {
  const date = DateTime.fromISO(session.date);
  const input: SessionInput = {
    ...values,
    confirmed: session.confirmed,
    date: date.set({ weekday: DateTime.fromISO(values.runsFrom).weekday }).toISODate(),
  };
  if (session.trainingId != null) {
    input.trainingId = session.trainingId;
  }
  if (input.notes != null && input.notes.length === 0) {
    delete input.notes;
  }
  return input;
}

function getInitialValues(session: Session): FormValues {
  return {
    type: session.type,
    runsFrom: session.runsFrom,
    time: session.time,
    clientIds: session.clientIds,
    notes: session.notes ?? '',
  };
}

const EditSessionDialogContent: React.FC<Props> = ({ session, clients, onSessionChanged, onCancelClick }) => {
  const [changeType, setChangeType] = useState(ChangeType.SINGLE);
  const { sessionRepo } = useRepos();

  async function handleFormSubmission(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) {
    const changedSession = await sessionRepo.update(changeType, session.id, getSessionInput(session, values));
    setSubmitting(false);
    onSessionChanged(changedSession);
  }

  return (
    <>
      <DialogHeader title="Training bearbeiten" onCloseClick={onCancelClick} />
      <Formik<FormValues>
        initialValues={getInitialValues(session)}
        validate={validateTrainingForm}
        onSubmit={handleFormSubmission}
      >
        {({ isValid, isSubmitting, submitForm }) => (
          <>
            <DialogBody>
              <Form className="p-4">
                <SessionFormFields clients={clients} disabled={isSubmitting} />
              </Form>
            </DialogBody>
            <DialogFooter>
              <div className="-mt-2 p-4 flex flex-wrap items-baseline justify-end">
                {session.trainingId != null && (
                  // eslint-disable-next-line jsx-a11y/no-onchange
                  <select
                    className="mt-2 form-select"
                    aria-label="Änderungsart"
                    value={changeType}
                    disabled={isSubmitting}
                    onChange={e => setChangeType(e.currentTarget.value as ChangeType)}
                  >
                    <option value={ChangeType.SINGLE}>Nur diese</option>
                    <option value={ChangeType.ALL_FOLLOWING}>Alle zukünftigen</option>
                    <option value={ChangeType.ALL_NON_CONFIRMED}>Alle offenen</option>
                  </select>
                )}
                <div className="mt-2 ml-4 flex-grow flex justify-end">
                  <Button disabled={isSubmitting} onClick={onCancelClick}>
                    Verwerfen
                  </Button>
                  <Button
                    className="ml-2"
                    type="submit"
                    color="orange"
                    loading={isSubmitting}
                    disabled={!isValid}
                    onClick={submitForm}
                  >
                    Speichern
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        )}
      </Formik>
    </>
  );
};

export default EditSessionDialogContent;
