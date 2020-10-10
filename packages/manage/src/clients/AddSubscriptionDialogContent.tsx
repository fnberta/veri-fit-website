import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Subscription, SubscriptionType, TrainingType } from '@veri-fit/common';
import { Button } from '@veri-fit/common-ui';
import { DialogFooter, DialogHeader } from '../Dialog';
import { getToday } from '../dateTime';
import { useRepos } from '../repositories/RepoContext';
import { getValidTrainingTypes } from '../subscriptionChecks';
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

function getInitialValues(today: string): SubscriptionFormValues {
  return {
    type: SubscriptionType.LIMITED_10,
    trainingType: TrainingType.YOGA,
    trainingsLeft: getDefaultTrainingsLeft(SubscriptionType.LIMITED_10),
    start: today,
    paid: false,
    paidAt: getToday(),
  };
}

const AddSubscriptionDialogContent: React.FC<Props> = ({
  clientId,
  subscriptions,
  onSubscriptionAdded,
  onCancelClick,
}) => {
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

  return (
    <>
      <DialogHeader title="Abo hinzufügen" onCloseClick={onCancelClick} />
      <Formik<SubscriptionFormValues> onSubmit={handleFormSubmission} initialValues={getInitialValues(getToday())}>
        {({ isValid, isSubmitting, submitForm }) => (
          <>
            <Form className="dialog-body p-4">
              <SubscriptionFormFields trainingTypes={getValidTrainingTypes(subscriptions)} disabled={isSubmitting} />
            </Form>
            <DialogFooter className="flex justify-end p-4">
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