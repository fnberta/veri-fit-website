import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { SubscriptionType, TrainingType, User } from '../../shared/interfaces';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { getToday } from './dateTime';
import { useRepos } from './RepoContext';
import SubscriptionFormFields from './SubscriptionFormFields';
import UserFormFields from './UserFormFields';
import { UserWithSubscriptionInput } from './UserRepository';

export interface Props {
  onUserCreated: (user: User) => void;
  onCancelClick: React.MouseEventHandler;
}

function getInitialValues(today: string): UserWithSubscriptionInput {
  return {
    name: '',
    email: '',
    birthday: '',
    address: {
      street: '',
      number: '',
      zip: '',
      city: '',
    },
    phone: '',
    subscription: {
      type: SubscriptionType.LIMITED_10,
      category: TrainingType.YOGA,
      start: today,
      paid: false,
    },
  };
}

const AddUserDialog: React.FC<Props> = ({ onUserCreated, onCancelClick }) => {
  const { userRepo } = useRepos();

  async function handleFormSubmission(
    values: UserWithSubscriptionInput,
    { setSubmitting }: FormikHelpers<UserWithSubscriptionInput>,
  ) {
    const user = await userRepo.create(values);
    setSubmitting(false);
    onUserCreated(user);
  }

  const today = getToday();
  return (
    <Formik<UserWithSubscriptionInput>
      initialValues={getInitialValues(today)}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleFormSubmission}
    >
      {({ errors, isSubmitting, isValid, submitForm }) => (
        <Dialog
          title="Neuer Teilnehmer"
          onCloseClick={onCancelClick}
          body={
            <Form>
              <UserFormFields errors={errors} birthdayMax={today} disabled={isSubmitting} />
              <SubscriptionFormFields errors={errors.subscription} disabled={isSubmitting} parentName="subscription" />
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
        />
      )}
    </Formik>
  );
};

export default AddUserDialog;
