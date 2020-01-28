import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Client, Training, TrainingInput, TrainingType } from '../../shared';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { useRepos } from './repositories/RepoContext';
import TrainingFormFields from './TrainingFormFields';

export interface Props {
  clients: Client[];
  onTrainingCreated: (training: Training) => void;
  onCancelClick: React.MouseEventHandler;
}

const initialValues: TrainingInput = {
  type: TrainingType.YOGA,
  weekday: 1,
  time: {
    start: '',
    end: '',
  },
  clientIds: [],
};

const AddTrainingDialog: React.FC<Props> = ({ clients, onTrainingCreated, onCancelClick }) => {
  const { trainingRepo } = useRepos();

  async function handleFormSubmission(values: TrainingInput, { setSubmitting }: FormikHelpers<TrainingInput>) {
    const training = await trainingRepo.create(values);
    setSubmitting(false);
    onTrainingCreated(training);
  }

  return (
    <Formik<TrainingInput> initialValues={initialValues} onSubmit={handleFormSubmission}>
      {({ isValid, isSubmitting, submitForm }) => (
        <Dialog
          title="Neues Training"
          body={
            <Form>
              <TrainingFormFields clients={clients} disabled={isSubmitting} />
            </Form>
          }
          footer={
            <>
              <Button
                text="Erstellen"
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

export default AddTrainingDialog;
