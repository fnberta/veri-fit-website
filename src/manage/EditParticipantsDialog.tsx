import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Session, Client } from '../../shared';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { FormField } from '../components/bulma/Forms';
import ParticipantsSelector from './ParticipantsSelector';
import { useRepos } from './repositories/RepoContext';

export interface Props {
  session: Session;
  clients: Client[];

  onSessionUpdated: (session: Session) => void;
  onCancelClick: React.MouseEventHandler;
}

interface FormValues {
  clientIds: string[];
}

const EditParticipantsDialog: React.FC<Props> = ({ session, clients, onSessionUpdated, onCancelClick }) => {
  const { sessionRepo } = useRepos();

  async function handleFormSubmission(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) {
    const updatedSession = await sessionRepo.update({ ...session, clientIds: values.clientIds });
    setSubmitting(false);
    onSessionUpdated(updatedSession);
  }

  return (
    <Formik<FormValues>
      initialValues={{ clientIds: session.clientIds }}
      isInitialValid={true}
      onSubmit={handleFormSubmission}
    >
      {({ isValid, isSubmitting, submitForm }) => (
        <Dialog
          title={`${session.category} - ${session.date}`}
          body={
            <Form>
              <FormField label="Teilnehmer" control={<ParticipantsSelector name="clientIds" clients={clients} />} />
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

export default EditParticipantsDialog;
