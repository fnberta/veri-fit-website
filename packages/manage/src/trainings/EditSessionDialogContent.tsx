import { Form, Formik, FormikHelpers } from 'formik';
import { DateTime } from 'luxon';
import React, { FC, useState } from 'react';
import { ChangeType, Client, Session, SessionInput } from '@veri-fit/common';
import { Button, Select } from '@veri-fit/common-ui';
import { DialogFooter, DialogHeader } from '../Dialog';
import { useRepos } from '../repositories/RepoContext';
import SessionFormFields, { SessionFormValues } from './SessionFormFields';
import { validateTrainingForm } from './TrainingFormFields';

export interface Props {
  session: Session;
  clients: Client[];
  onSessionChanged: (session: Session) => void;
  onCancelClick: () => void;
}

function getSessionInput(session: Session, values: SessionFormValues): SessionInput {
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

function getInitialValues(session: Session): SessionFormValues {
  return {
    type: session.type,
    runsFrom: session.runsFrom,
    time: session.time,
    clientIds: session.clientIds,
    notes: session.notes ?? '',
  };
}

const EditSessionDialogContent: FC<Props> = ({ session, clients, onSessionChanged, onCancelClick }) => {
  const [changeType, setChangeType] = useState(ChangeType.SINGLE);
  const { sessionRepo } = useRepos();

  async function handleFormSubmission(values: SessionFormValues, { setSubmitting }: FormikHelpers<SessionFormValues>) {
    const changedSession = await sessionRepo.update(changeType, session.id, getSessionInput(session, values));
    setSubmitting(false);
    onSessionChanged(changedSession);
  }

  return (
    <>
      <DialogHeader title="Training bearbeiten" onCloseClick={onCancelClick} />
      <Formik<SessionFormValues>
        initialValues={getInitialValues(session)}
        validate={validateTrainingForm}
        onSubmit={handleFormSubmission}
      >
        {({ isValid, isSubmitting, submitForm }) => (
          <>
            <Form className="dialog-body p-4 space-y-4">
              <SessionFormFields clients={clients} disabled={isSubmitting} />
            </Form>
            <DialogFooter className="-mt-2 p-4 flex flex-wrap items-baseline justify-end">
              {session.trainingId != null && (
                <Select
                  className="mt-2 flex-1"
                  aria-label="Änderungsart"
                  value={changeType}
                  disabled={isSubmitting}
                  onChange={(e) => setChangeType(e.currentTarget.value as ChangeType)}
                >
                  <option value={ChangeType.SINGLE}>Nur dieses</option>
                  <option value={ChangeType.ALL_FOLLOWING}>Alle zukünftige</option>
                  <option value={ChangeType.ALL_NON_CONFIRMED}>Alle offenen</option>
                </Select>
              )}
              <div className="mt-2 ml-4 flex-grow flex justify-end space-x-2">
                <Button shape="outlined" disabled={isSubmitting} onClick={onCancelClick}>
                  Verwerfen
                </Button>
                <Button type="submit" loading={isSubmitting} disabled={!isValid} onClick={submitForm}>
                  Speichern
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </Formik>
    </>
  );
};

export default EditSessionDialogContent;
