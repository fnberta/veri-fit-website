import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { ChangeType, Client, Session, TrainingInput } from '../../shared';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { useRepos } from './repositories/RepoContext';
import TrainingFormFields from './TrainingFormFields';

export interface Props {
  session: Session;
  clients: Client[];
  onSessionChanged: (session: Session) => void;
  onCancelClick: React.MouseEventHandler;
}

function getInitialValues(session: Session): TrainingInput {
  return {
    type: session.type,
    weekday: session.weekday,
    time: session.time,
    clientIds: session.clientIds,
  };
}

const EditSessionDialog: React.FC<Props> = ({ session, clients, onSessionChanged, onCancelClick }) => {
  const { sessionRepo } = useRepos();

  async function handleFormSubmission(values: TrainingInput, { setSubmitting }: FormikHelpers<TrainingInput>) {
    const changedSession = await sessionRepo.update(ChangeType.SINGLE, session, values);
    setSubmitting(false);
    onSessionChanged(changedSession);
  }

  return (
    <Formik<TrainingInput> onSubmit={handleFormSubmission} initialValues={getInitialValues(session)}>
      {({ isValid, isSubmitting, submitForm }) => (
        <Dialog
          title="Training bearbeiten"
          body={
            <Form>
              <TrainingFormFields clients={clients} disabled={isSubmitting} />
            </Form>
          }
          footer={
            <>
              <Button
                text="Speichern"
                type="submit"
                intent="primary"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
                onClick={submitForm}
              />
              <Button text="Verwerfen" disabled={isSubmitting} onClick={onCancelClick} />
            </>
          }
          onCloseClick={onCancelClick}
        />
      )}
    </Formik>
  );
};

export default EditSessionDialog;
