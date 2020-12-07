import { Form, Formik, FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { Client, Training, TrainingInput, TrainingType } from '@veri-fit/common';
import { Button } from '@veri-fit/common-ui';
import { DialogFooter, DialogHeader } from '../Dialog';
import { getToday } from '../dateTime';
import { useRepos } from '../repositories/RepoContext';
import TrainingFormFields, { validateTrainingForm } from './TrainingFormFields';

export interface Props {
  clients: Client[];
  onTrainingCreated: (training: Training) => void;
  onCancelClick: () => void;
}

function getInitialValues(runsFrom: string): TrainingInput {
  return {
    type: TrainingType.YOGA,
    runsFrom,
    time: {
      start: '',
      end: '',
    },
    clientIds: [],
  };
}

const AddTrainingDialogContent: FC<Props> = ({ clients, onTrainingCreated, onCancelClick }) => {
  const { trainingRepo } = useRepos();

  async function handleFormSubmission(values: TrainingInput, { setSubmitting }: FormikHelpers<TrainingInput>) {
    const training = await trainingRepo.create(values);
    setSubmitting(false);
    onTrainingCreated(training);
  }

  return (
    <>
      <DialogHeader title="Neue Trainingsreihe" onCloseClick={onCancelClick} />
      <Formik<TrainingInput>
        initialValues={getInitialValues(getToday())}
        validate={validateTrainingForm}
        onSubmit={handleFormSubmission}
      >
        {({ isValid, isSubmitting, submitForm }) => (
          <>
            <Form className="dialog-body p-4 space-y-3">
              <TrainingFormFields clients={clients} disabled={isSubmitting} />
            </Form>
            <DialogFooter className="flex justify-end p-4 space-x-2">
              <Button shape="outlined" disabled={isSubmitting} onClick={onCancelClick}>
                Verwerfen
              </Button>
              <Button type="submit" loading={isSubmitting} disabled={!isValid} onClick={submitForm}>
                Erstellen
              </Button>
            </DialogFooter>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddTrainingDialogContent;
