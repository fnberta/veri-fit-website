import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { User } from '../../shared/interfaces';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { getToday } from './dateTime';
import { useRepos } from './RepoContext';
import UserFormFields from './UserFormFields';
import { UserInput } from './UserRepository';

export interface Props {
  user: User;
  onUserUpdated: (user: User) => void;
  onCancelClick: React.MouseEventHandler;
}

function getInitialValues(user: User): UserInput {
  return {
    name: user.name,
    email: user.email,
    birthday: user.birthday,
    address: {
      street: user.address.street,
      number: user.address.number,
      zip: user.address.zip,
      city: user.address.city,
    },
    phone: user.phone,
  };
}

const EditUserDialog: React.FC<Props> = ({ user, onUserUpdated, onCancelClick }) => {
  const { userRepo } = useRepos();

  async function handleFormSubmission(values: UserInput, { setSubmitting }: FormikHelpers<UserInput>) {
    const updatedUser = await userRepo.update(user.id, values);
    setSubmitting(false);
    onUserUpdated(updatedUser);
  }

  return (
    <Formik<UserInput>
      initialValues={getInitialValues(user)}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleFormSubmission}
    >
      {({ errors, dirty, isSubmitting, isValid, submitForm }) => (
        <Dialog
          title={`${user.name} bearbeiten`}
          onCloseClick={onCancelClick}
          body={
            <Form>
              <UserFormFields errors={errors} birthdayMax={getToday()} disabled={isSubmitting} />
            </Form>
          }
          footer={
            <>
              <Button
                text="Speichern"
                type="submit"
                intent="primary"
                loading={isSubmitting}
                disabled={!dirty || !isValid || isSubmitting}
                onClick={submitForm}
              />
              <Button text="Verwerfen" disabled={isSubmitting} onClick={onCancelClick} />
            </>
          }
        />
      )}
    </Formik>
  );
};

export default EditUserDialog;
