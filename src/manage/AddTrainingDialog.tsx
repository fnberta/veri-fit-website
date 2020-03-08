import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Client, Training, TrainingInput, TrainingType } from '../../shared';
import { Button } from '../components/Button';
import Dialog from '../components/Dialog';
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

const AddTrainingDialog: React.FC<Props> = ({ clients, onTrainingCreated, onCancelClick }) => {
  const { trainingRepo } = useRepos();

  async function handleFormSubmission(values: TrainingInput, { setSubmitting }: FormikHelpers<TrainingInput>) {
    const training = await trainingRepo.create(values);
    setSubmitting(false);
    onTrainingCreated(training);
  }

  return (
    <Formik<TrainingInput>
      initialValues={getInitialValues(getToday())}
      validate={validateTrainingForm}
      onSubmit={handleFormSubmission}
    >
      {({ isValid, isSubmitting, submitForm }) => (
        <Dialog
          title="Neues Training"
          body={
            <Form className="p-4">
              <TrainingFormFields clients={clients} disabled={isSubmitting} />
            </Form>
          }
          footer={
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
          }
          onCloseClick={onCancelClick}
        />
      )}
    </Formik>
  );
};

export default AddTrainingDialog;
