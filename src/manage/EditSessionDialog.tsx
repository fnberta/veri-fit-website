import styled from '@emotion/styled';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { ChangeType, Client, Session, SessionInput, TrainingInput } from '../../shared';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { FormField } from '../components/bulma/Forms';
import { useRepos } from './repositories/RepoContext';
import TrainingFormFields, { validateTrainingForm } from './TrainingFormFields';

export interface Props {
  session: Session;
  clients: Client[];
  onSessionChanged: (session: Session) => void;
  onCancelClick: React.MouseEventHandler;
}

interface FormValues extends TrainingInput {
  notes: string;
}

const FooterLayout = styled.div({
  flex: '1',
  display: 'flex',
  justifyContent: 'space-between',
});

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
            <Form>
              <TrainingFormFields clients={clients} disabled={isSubmitting} />
              <FormField
                label="Notizen"
                error={<ErrorMessage name="notes" />}
                control={
                  <Field
                    className="textarea"
                    as="textarea"
                    type="text"
                    name="notes"
                    title="Notizen"
                    disabled={isSubmitting}
                  />
                }
              />
            </Form>
          }
          footer={
            <FooterLayout>
              <div className="select">
                {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                <select
                  title="Änderungsart"
                  value={changeType}
                  disabled={isSubmitting}
                  onChange={e => setChangeType(e.currentTarget.value as ChangeType)}
                >
                  <option value={ChangeType.SINGLE}>Nur diese</option>
                  <option value={ChangeType.ALL_FOLLOWING}>Alle zukünftigen</option>
                  <option value={ChangeType.ALL_NON_CONFIRMED}>Alle offenen</option>
                </select>
              </div>
              <div>
                <Button text="Verwerfen" disabled={isSubmitting} onClick={onCancelClick} />
                <Button
                  text="Speichern"
                  type="submit"
                  intent="primary"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  onClick={submitForm}
                />
              </div>
            </FooterLayout>
          }
          onCloseClick={onCancelClick}
        />
      )}
    </Formik>
  );
};

export default EditSessionDialog;
