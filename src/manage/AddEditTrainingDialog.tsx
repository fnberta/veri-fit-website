import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Training, TrainingType, Client } from '../../shared';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { FormField } from '../components/bulma/Forms';
import { getTrainingName } from './displayNames';
import ParticipantsSelector from './ParticipantsSelector';
import { useRepos } from './repositories/RepoContext';
import { TrainingInput } from './repositories/TrainingRepository';
import { validSubscriptionTypes } from './subscriptionChecks';

export interface Props {
  training?: Training;
  clients: Client[];
  onTrainingChanged: (training: Training) => void;
  onCancelClick: React.MouseEventHandler;
}

function getInitialValues(training?: Training): TrainingInput {
  if (training) {
    return {
      type: training.type,
      weekday: training.weekday,
      time: training.time,
      clientIds: training.clientIds,
    };
  } else {
    return {
      type: TrainingType.YOGA,
      weekday: 1,
      time: {
        start: '',
        end: '',
      },
      clientIds: [],
    };
  }
}

const AddEditTrainingDialog: React.FC<Props> = ({ training, clients, onTrainingChanged, onCancelClick }) => {
  const { trainingRepo } = useRepos();

  async function handleFormSubmission(values: TrainingInput, { setSubmitting }: FormikHelpers<TrainingInput>) {
    const newTraining = training ? await trainingRepo.update(training.id, values) : await trainingRepo.create(values);
    setSubmitting(false);
    onTrainingChanged(newTraining);
  }

  return (
    <Formik<TrainingInput> onSubmit={handleFormSubmission} initialValues={getInitialValues(training)}>
      {({ isValid, isSubmitting, submitForm }) => (
        <Dialog
          title={training ? 'Training bearbeiten' : 'Neues Training'}
          body={
            <Form>
              <FormField
                label="Typ"
                error={<ErrorMessage name="type" />}
                control={
                  <div className="select">
                    <Field as="select" name="type">
                      {Object.keys(validSubscriptionTypes).map(trainingType => (
                        <option key={trainingType} value={trainingType}>
                          {getTrainingName(trainingType as TrainingType)}
                        </option>
                      ))}
                    </Field>
                  </div>
                }
              />
              <FormField
                label="Wochentag"
                error={<ErrorMessage name="weekday" />}
                control={
                  <div className="select">
                    <Field as="select" name="weekday">
                      <option value={1}>Montag</option>
                      <option value={2}>Dienstag</option>
                      <option value={3}>Mittwoch</option>
                      <option value={4}>Donnerstag</option>
                      <option value={5}>Freitag</option>
                      <option value={6}>Samstag</option>
                      <option value={7}>Sonntag</option>
                    </Field>
                  </div>
                }
              />
              <FormField
                label="Startzeit"
                error={<ErrorMessage name="time.start" />}
                control={
                  <Field
                    className="input"
                    type="time"
                    name="time.start"
                    placeholder="Startzeit"
                    disabled={isSubmitting}
                  />
                }
              />
              <FormField
                label="Endzeit"
                error={<ErrorMessage name="time.end" />}
                control={
                  <Field className="input" type="time" name="time.end" placeholder="Endzeit" disabled={isSubmitting} />
                }
              />
              <FormField label="Teilnehmer" control={<ParticipantsSelector name="clientIds" clients={clients} />} />
            </Form>
          }
          footer={
            <>
              <Button
                text={training ? 'Speichern' : 'Erstellen'}
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

export default AddEditTrainingDialog;
