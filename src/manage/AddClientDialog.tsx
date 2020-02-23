import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import React from 'react';
import { Client, SubscriptionType, TrainingType } from '../../shared';
import Dialog from '../components/Dialog';
import ClientFormFields, { ClientFormValues, getClientInput, validateClientForm } from './ClientFormFields';
import { getToday } from './dateTime';
import { useRepos } from './repositories/RepoContext';
import SubscriptionFormFields, {
  getDefaultTrainingsLeft,
  getSubscriptionInput,
  SubscriptionFormValues,
  validateSubscriptionForm,
} from './SubscriptionFormFields';
import { Button } from '../components/Button';

export interface Props {
  onClientCreated: (client: Client) => void;
  onCancelClick: () => void;
}

interface FormValues extends ClientFormValues {
  subscription: SubscriptionFormValues;
}

function validate(values: FormValues): FormikErrors<FormValues> {
  const { subscription, ...clientValues } = values;
  const clientErrors = validateClientForm(clientValues);
  const subscriptionErrors = validateSubscriptionForm(subscription);
  return {
    ...clientErrors,
    ...subscriptionErrors,
  };
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
      trainingType: TrainingType.YOGA,
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
    const { subscription, ...clientValues } = values;
    const client = await clientRepo.create(getClientInput(clientValues), getSubscriptionInput(subscription));
    setSubmitting(false);
    onClientCreated(client);
  }

  return (
    <Formik<FormValues>
      initialValues={getInitialValues(getToday())}
      validate={validate}
      validateOnMount={true}
      onSubmit={handleFormSubmission}
    >
      {({ isSubmitting, isValid, submitForm }) => (
        <Dialog
          title="Neuer Teilnehmer"
          body={
            <Form>
              <ClientFormFields disabled={isSubmitting} />
              <hr className="my-2" />
              <div className="p-4">
                <h2 className="text-base font-semibold">Abo</h2>
                <div className="mt-4">
                  <SubscriptionFormFields disabled={isSubmitting} namespace="subscription" />
                </div>
              </div>
            </Form>
          }
          footer={
            <div className="p-4 flex justify-end">
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

export default AddClientDialog;
