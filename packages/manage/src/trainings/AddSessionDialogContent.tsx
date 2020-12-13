import { Form, Formik, FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { Client, Session, SessionInput, TrainingType } from '@veri-fit/common';
import { Button } from '@veri-fit/common-ui';
import { DialogFooter, DialogHeader } from '../Dialog';
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

const AddSessionDialogContent: FC<Props> = ({ clients, onSessionAdded, onCancelClick }) => {
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
            <Form className="dialog-body p-4 space-y-4">
              <SessionFormFields clients={clients} disabled={isSubmitting} />
            </Form>
            <DialogFooter className="flex justify-end p-4 space-x-2">
              <Button shape="outlined" disabled={isSubmitting} onClick={onCancelClick}>
                Verwerfen
              </Button>
              <Button type="submit" loading={isSubmitting} disabled={!isValid} onClick={submitForm}>
                Speichern
              </Button>
            </DialogFooter>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddSessionDialogContent;
