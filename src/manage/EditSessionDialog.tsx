import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { ChangeType, Client, Session, SessionInput, TrainingInput } from '../../shared';
import Dialog from '../components/Dialog';
import { FormField } from '../components/Forms';
import { useRepos } from './repositories/RepoContext';
import TrainingFormFields, { validateTrainingForm } from './TrainingFormFields';
import { Button } from '../components/Button';

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
  const sessionInput: SessionInput = {
    ...values,
    trainingId: session.trainingId,
    confirmed: session.confirmed,
    date: date.set({ weekday: DateTime.fromISO(values.runsFrom).weekday }).toISODate(),
  };
  if (sessionInput.notes != null && sessionInput.notes.length === 0) {
    delete sessionInput.notes;
  }
  return sessionInput;
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

const EditSessionDialog: React.FC<Props> = ({ session, clients, onSessionChanged, onCancelClick }) => {
  const [changeType, setChangeType] = useState(ChangeType.SINGLE);
  const { sessionRepo } = useRepos();

  async function handleFormSubmission(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) {
    const changedSession = await sessionRepo.update(changeType, session.id, getSessionInput(session, values));
    setSubmitting(false);
    onSessionChanged(changedSession);
  }

  return (
    <Formik<FormValues>
      initialValues={getInitialValues(session)}
      validate={validateTrainingForm}
      onSubmit={handleFormSubmission}
    >
      {({ isValid, isSubmitting, submitForm }) => (
        <Dialog
          title="Training bearbeiten"
          body={
            <Form className="p-4">
              <TrainingFormFields clients={clients} disabled={isSubmitting} />
              <FormField
                className="mt-3"
                label="Notizen"
                error={<ErrorMessage name="notes" />}
                control={
                  <Field
                    className="w-full form-textarea"
                    as="textarea"
                    type="text"
                    name="notes"
                    disabled={isSubmitting}
                  />
                }
              />
            </Form>
          }
          footer={
            <div className="-mt-2 p-4 flex flex-wrap items-baseline justify-end">
              {/* eslint-disable-next-line jsx-a11y/no-onchange */}
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
          }
          onCloseClick={onCancelClick}
        />
      )}
    </Formik>
  );
};

export default EditSessionDialog;
