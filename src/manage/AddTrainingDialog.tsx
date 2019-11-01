import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { ParticipantsMap, Training, TrainingType, User } from '../../shared/interfaces';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { FormField, HorizontalField } from '../components/bulma/Forms';
import { useRepos } from './RepoContext';
import { TrainingInput } from './TrainingRepository';

export interface Props {
  onTrainingCreated: (training: Training) => void;
  onCancelClick: React.MouseEventHandler;
}

const MAX_PARTICIPANTS_SIZE = 5;

const initialValues: TrainingInput = {
  type: TrainingType.YOGA,
  weekday: 1,
  time: {
    start: '',
    end: '',
  },
  participants: [],
};

const AddTrainingDialog: React.FC<Props> = ({ onTrainingCreated, onCancelClick }) => {
  const [users, setUsers] = useState([] as User[]);
  const { userRepo, trainingRepo } = useRepos();

  useEffect(() => userRepo.observeAll(setUsers), [userRepo]);

  async function handleFormSubmission(values: TrainingInput, { setSubmitting }: FormikHelpers<TrainingInput>) {
    const training = await trainingRepo.create(values);
    setSubmitting(false);
    onTrainingCreated(training);
  }

  return (
    <Formik<TrainingInput> onSubmit={handleFormSubmission} initialValues={initialValues}>
      {({ values, errors, isValid, isSubmitting, submitForm, setFieldValue, handleBlur }) => (
        <Dialog
          title="Neues Training"
          body={
            <Form>
              <HorizontalField label="Typ">
                <FormField
                  error={errors.type}
                  control={
                    <div className="select">
                      <Field as="select" aria-label="Training-Typ" name="type">
                        <option value={TrainingType.YOGA}>Yoga</option>
                        <option value={TrainingType.BOOST}>Boost</option>
                      </Field>
                    </div>
                  }
                />
              </HorizontalField>
              <HorizontalField label="Wochentag">
                <FormField
                  error={errors.weekday}
                  control={
                    <div className="select">
                      <Field as="select" aria-label="Wochentag" name="weekday">
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
              </HorizontalField>
              <HorizontalField label="Tageszeit">
                <FormField
                  help="Start"
                  error={errors.time && errors.time.start}
                  control={
                    <Field
                      className="input"
                      aria-label="Startzeit"
                      type="time"
                      name="time.start"
                      placeholder="Startzeit"
                      disabled={isSubmitting}
                    />
                  }
                />
              </HorizontalField>
              <HorizontalField label="">
                <FormField
                  help="Ende"
                  error={errors.time && errors.time.start}
                  control={
                    <Field
                      className="input"
                      aria-label="Endzeit"
                      type="time"
                      name="time.end"
                      placeholder="Endzeit"
                      disabled={isSubmitting}
                    />
                  }
                />
              </HorizontalField>
              <HorizontalField label="Teilnehmer">
                <FormField
                  control={
                    <div className="select is-multiple">
                      <select
                        name="participants"
                        aria-label="Teilnehmer"
                        multiple={true}
                        size={users.length > MAX_PARTICIPANTS_SIZE ? MAX_PARTICIPANTS_SIZE : users.length}
                        value={values.participants.map(user => user.id)}
                        onBlur={handleBlur}
                        onChange={e => {
                          const selectedOptions = Array.from(e.currentTarget.selectedOptions).map(
                            option => option.value,
                          );
                          const participants = users
                            .filter(user => selectedOptions.includes(user.id))
                            .map(user => ({ id: user.id, name: user.name }));
                          setFieldValue('participants', participants);
                        }}
                      >
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  }
                />
              </HorizontalField>
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
