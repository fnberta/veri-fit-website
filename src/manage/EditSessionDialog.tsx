import { Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { FormField, HorizontalField } from '../components/bulma/Forms';
import { MiniUser, ParticipantsMap, Session, User } from '../../shared/interfaces';
import { useRepos } from './RepoContext';

export interface Props {
  session: Session;
  onSessionUpdated: (session: Session) => void;
  onCancelClick: React.MouseEventHandler;
}

interface FormValues {
  participants: MiniUser[];
}

const MAX_PARTICIPANTS_SIZE = 5;

const EditSessionDialog: React.FC<Props> = ({ session, onSessionUpdated, onCancelClick }) => {
  const [users, setUsers] = useState([] as User[]);
  const { userRepo, sessionRepo } = useRepos();

  useEffect(() => userRepo.observeAll(setUsers), [userRepo]);

  async function handleFormSubmission(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) {
    const updatedSession = await sessionRepo.update({
      ...session,
      ...values,
      confirmed: true,
    });
    setSubmitting(false);
    onSessionUpdated(updatedSession);
  }

  return (
    <Formik<FormValues>
      initialValues={{ participants: session.participants }}
      isInitialValid={true}
      onSubmit={handleFormSubmission}
    >
      {({ values, isValid, isSubmitting, submitForm, setFieldValue, handleBlur }) => (
        <Dialog
          title={`${session.category} - ${session.date}`}
          body={
            <Form>
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
                text="Bestätigen"
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
