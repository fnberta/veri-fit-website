import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Client, Training, TrainingInput, TrainingType } from '../../shared';
import { Button } from '../components/Button';
import { DialogBody, DialogFooter, DialogHeader } from '../components/Dialog';
import { getToday } from './dateTime';
import { useRepos } from './repositories/RepoContext';
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

const AddTrainingDialogContent: React.FC<Props> = ({ clients, onTrainingCreated, onCancelClick }) => {
  const { trainingRepo } = useRepos();

  async function handleFormSubmission(values: TrainingInput, { setSubmitting }: FormikHelpers<TrainingInput>) {
    const training = await trainingRepo.create(values);
    setSubmitting(false);
    onTrainingCreated(training);
  }

  return (
    <>
      <DialogHeader title="Neues Training" onCloseClick={onCancelClick} />
      <Formik<TrainingInput>
        initialValues={getInitialValues(getToday())}
        validate={validateTrainingForm}
        onSubmit={handleFormSubmission}
      >
        {({ isValid, isSubmitting, submitForm }) => (
          <>
            <DialogBody>
              <Form className="p-4">
                <TrainingFormFields clients={clients} disabled={isSubmitting} />
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
                  Erstellen
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddTrainingDialogContent;
