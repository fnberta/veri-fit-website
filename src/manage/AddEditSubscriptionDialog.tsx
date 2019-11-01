import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Subscription, SubscriptionType, TrainingType } from '../../shared/interfaces';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { getToday } from './dateTime';
import { useRepos } from './RepoContext';
import SubscriptionFormFields from './SubscriptionFormFields';
import { SubscriptionInput } from './UserRepository';

export interface Props {
  subscription?: Subscription;
  userId: string;
  onSubscriptionChanged: (subscription: Subscription) => void;
  onCancelClick: React.MouseEventHandler;
}

function getInitialValues(today: string, subscription?: Subscription): SubscriptionInput {
  if (subscription) {
    return {
      type: subscription.type,
      category: subscription.category,
      start: subscription.start,
      paid: subscription.paidAt != null,
    };
  } else {
    return {
      type: SubscriptionType.LIMITED_10,
      category: TrainingType.YOGA,
      start: today,
      paid: false,
    };
  }
}

const AddEditSubscriptionDialog: React.FC<Props> = ({ subscription, userId, onSubscriptionChanged, onCancelClick }) => {
  const { userRepo } = useRepos();

  async function handleFormSubmission(values: SubscriptionInput, { setSubmitting }: FormikHelpers<SubscriptionInput>) {
    const newSubscription = subscription
      ? await userRepo.updateSubscription(userId, subscription.id, values)
      : await userRepo.createSubscription(userId, values);
    setSubmitting(false);
    onSubscriptionChanged(newSubscription);
  }

  const today = getToday();
  return (
    <Formik<SubscriptionInput> onSubmit={handleFormSubmission} initialValues={getInitialValues(today, subscription)}>
      {({ errors, dirty, isValid, isSubmitting, submitForm }) => (
        <Dialog
          title={subscription ? 'Abo bearbeiten' : 'Abo hinzufügen'}
          body={<SubscriptionFormFields errors={errors} disabled={isSubmitting} />}
          footer={
            <>
              <Button
                text="Speichern"
                type="submit"
                intent="primary"
                loading={isSubmitting}
                disabled={(subscription != null && !dirty) || !isValid || isSubmitting}
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

export default AddEditSubscriptionDialog;
