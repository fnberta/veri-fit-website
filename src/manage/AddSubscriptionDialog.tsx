import styled from '@emotion/styled';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Subscription, SubscriptionType, TrainingType } from '../../shared';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { getToday } from './dateTime';
import { useRepos } from './repositories/RepoContext';
import SubscriptionFormFields, {
  getDefaultTrainingsLeft,
  getSubscriptionInput,
  SubscriptionFormValues,
} from './SubscriptionFormFields';

export interface Props {
  clientId: string;
  onSubscriptionAdded: (subscription: Subscription) => void;
  onCancelClick: React.MouseEventHandler;
}

const FooterLayout = styled.div({
  flex: '1',
  display: 'flex',
  justifyContent: 'flex-end',
});

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

const AddSubscriptionDialog: React.FC<Props> = ({ clientId, onSubscriptionAdded, onCancelClick }) => {
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
    <Formik<SubscriptionFormValues> onSubmit={handleFormSubmission} initialValues={getInitialValues(getToday())}>
      {({ isValid, isSubmitting, submitForm }) => (
        <Dialog
          title="Abo hinzufügen"
          body={<SubscriptionFormFields disabled={isSubmitting} />}
          footer={
            <FooterLayout>
              <Button text="Verwerfen" disabled={isSubmitting} onClick={onCancelClick} />
              <Button
                text="Speichern"
                type="submit"
                intent="primary"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
                onClick={submitForm}
              />
            </FooterLayout>
          }
          onCloseClick={onCancelClick}
        />
      )}
    </Formik>
  );
};

export default AddSubscriptionDialog;
