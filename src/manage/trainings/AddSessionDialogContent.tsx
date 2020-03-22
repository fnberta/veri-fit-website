import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Client, Session, SessionInput, TrainingType } from '../../../shared';
import { Button } from '../../common/components/Button';
import { DialogBody, DialogFooter, DialogHeader } from '../../common/components/Dialog';
import { getToday } from '../dateTime';
import { useRepos } from '../repositories/RepoContext';
import SessionFormFields, { SessionFormValues } from './SessionFormFields';
import { validateTrainingForm } from './TrainingFormFields';

export interface Props {
  clients: Client[];
  onSessionAdded: (session: Session) => void;
  onCancelClick: () => void;
}

function getSessionInput(values: SessionFormValues): SessionInput {
  const input: SessionInput = {
    ...values,
    confirmed: false,
    date: values.runsFrom,
  };
  if (input.notes != null && input.notes.length === 0) {
    delete input.notes;
  }
  return input;
}

function getInitialValues(runsFrom: string): SessionFormValues {
  return {
    type: TrainingType.YOGA,
    runsFrom,
    time: {
      start: '',
      end: '',
    },
    clientIds: [],
    notes: '',
  };
}

const AddSessionDialogContent: React.FC<Props> = ({ clients, onSessionAdded, onCancelClick }) => {
  const { sessionRepo } = useRepos();

  async function handleFormSubmission(values: SessionFormValues, { setSubmitting }: FormikHelpers<SessionFormValues>) {
    const session = await sessionRepo.createSingle(getSessionInput(values));
    setSubmitting(false);
    onSessionAdded(session);
  }

  return (
    <>
      <DialogHeader title="Neues Einzeltraining" onCloseClick={onCancelClick} />
      <Formik<SessionFormValues>
        initialValues={getInitialValues(getToday())}
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
              <div className="flex justify-end p-4">
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
            </DialogFooter>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddSessionDialogContent;
