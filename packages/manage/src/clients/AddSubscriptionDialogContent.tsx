import { Form, Formik, FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { Subscription, TrainingType } from '@veri-fit/common';
import { Button } from '@veri-fit/common-ui';
import { DialogFooter, DialogHeader } from '../Dialog';
import { getToday } from '../dateTime';
import { useRepos } from '../repositories/RepoContext';
import { getValidTrainingTypes, validSubscriptionTypes } from '../subscriptionChecks';
import SubscriptionFormFields, {
  getDefaultTrainingsLeft,
  getSubscriptionInput,
  SubscriptionFormValues,
} from './SubscriptionFormFields';

export interface Props {
  clientId: string;
  subscriptions: Subscription[];
  onSubscriptionAdded: (subscription: Subscription) => void;
  onCancelClick: () => void;
}

function getInitialValues(today: string, validTrainingTypes: TrainingType[]): SubscriptionFormValues {
  const trainingType = validTrainingTypes[0];
  const subscriptionTypes = validSubscriptionTypes[trainingType];
  const subscriptionType = subscriptionTypes[0];
  return {
    type: subscriptionType,
    trainingType,
    trainingsLeft: getDefaultTrainingsLeft(subscriptionType),
    start: today,
    paid: false,
    paidAt: getToday(),
  };
}

const AddSubscriptionDialogContent: FC<Props> = ({ clientId, subscriptions, onSubscriptionAdded, onCancelClick }) => {
  const { clientRepo } = useRepos();

  async function handleFormSubmission(
    values: SubscriptionFormValues,
    { setSubmitting }: FormikHelpers<SubscriptionFormValues>,
  ) {
    const input = getSubscriptionInput(values);
    const subscription = await clientRepo.createSubscription(clientId, input);
    setSubmitting(false);
    onSubscriptionAdded(subscription);
  }

  const validTrainingTypes = getValidTrainingTypes(subscriptions);
  return (
    <>
      <DialogHeader title="Abo hinzufügen" onCloseClick={onCancelClick} />
      <Formik<SubscriptionFormValues>
        onSubmit={handleFormSubmission}
        initialValues={getInitialValues(getToday(), validTrainingTypes)}
      >
        {({ isValid, isSubmitting, submitForm }) => (
          <>
            <Form className="dialog-body p-4 space-y-4">
              <SubscriptionFormFields trainingTypes={validTrainingTypes} disabled={isSubmitting} />
            </Form>
            <DialogFooter className="flex justify-end p-4 space-x-2">
              <Button shape="outlined" disabled={isSubmitting} onClick={onCancelClick}>
                Verwerfen
              </Button>
              <Button type="submit" loading={isSubmitting} disabled={!isValid} onClick={submitForm}>
                Speichern
              </Button>
            </DialogFooter>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddSubscriptionDialogContent;
