import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Client, SubscriptionType, TrainingType } from '../../shared';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import ClientFormFields from './ClientFormFields';
import { getToday } from './dateTime';
import { ClientInput } from './repositories/ClientRepository';
import { useRepos } from './repositories/RepoContext';
import SubscriptionFormFields, {
  getDefaultTrainingsLeft,
  mapToSubscriptionInput,
  SubscriptionFormValues,
} from './SubscriptionFormFields';

export interface Props {
  onClientCreated: (client: Client) => void;
  onCancelClick: React.MouseEventHandler;
}

interface FormValues extends ClientInput {
  subscription: SubscriptionFormValues;
}

function getInitialValues(today: string): FormValues {
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
      trainingsLeft: getDefaultTrainingsLeft(SubscriptionType.LIMITED_10),
      start: today,
      paid: false,
      paidAt: getToday(),
    },
    activeSubscriptions: [],
  };
}

const AddClientDialog: React.FC<Props> = ({ onClientCreated, onCancelClick }) => {
  const { clientRepo } = useRepos();

  async function handleFormSubmission(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) {
    const { subscription, ...clientInput } = values;
    const client = await clientRepo.create(clientInput, mapToSubscriptionInput(subscription));
    setSubmitting(false);
    onClientCreated(client);
  }

  return (
    <Formik<FormValues> initialValues={getInitialValues(getToday())} onSubmit={handleFormSubmission}>
      {({ isSubmitting, isValid, submitForm }) => (
        <Dialog
          title="Neuer Teilnehmer"
          onCloseClick={onCancelClick}
          body={
            <Form>
              <ClientFormFields disabled={isSubmitting} />
              <SubscriptionFormFields disabled={isSubmitting} namespace="subscription" />
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

export default AddClientDialog;
