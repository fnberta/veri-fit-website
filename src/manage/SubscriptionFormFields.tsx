import { ErrorMessage, Field, FormikErrors, getIn, useFormikContext } from 'formik';
import React from 'react';
import { SubscriptionType, TrainingType } from '../../shared';
import { FormField } from '../components/bulma/Forms';
import { getEndDate } from './dateTime';
import { getSubscriptionName, getTrainingName } from './displayNames';
import { SubscriptionInput } from './repositories/ClientRepository';
import { validSubscriptionTypes } from './subscriptionChecks';

export interface Props {
  namespace?: string;
  disabled: boolean;
}

export interface SubscriptionFormValues {
  type: SubscriptionType;
  trainingType: TrainingType;
  trainingsLeft: number;
  start: string; // YYYY-MM-DD
  paid: boolean;
  paidAt: string; // YYYY-MM-DD
}

export function validateSubscriptionForm(values: SubscriptionFormValues): FormikErrors<SubscriptionFormValues> {
  const errors: FormikErrors<SubscriptionFormValues> = {};

  if (values.start.length === 0) {
    errors.start = 'Startpunkt is erforderlich';
  }

  if (values.trainingsLeft == null) {
    errors.trainingsLeft = 'Trainings übrig ist erforderlich';
  }

  if (values.paid && values.paidAt.length === 0) {
    errors.paidAt = 'Bezahlt am ist erforderlich';
  }

  return errors;
}

export function getDefaultTrainingsLeft(type: SubscriptionType): number {
  switch (type) {
    case SubscriptionType.SINGLE:
      return 1;
    case SubscriptionType.LIMITED_10:
    case SubscriptionType.UNLIMITED_10:
      return 10;
    case SubscriptionType.LIMITED_20:
      return 20;
    case SubscriptionType.BLOCK:
      // return invalid high number, makes sure it gets overwritten when another selection is made
      return 9999;
  }
}
export function getSubscriptionInput(values: SubscriptionFormValues): SubscriptionInput {
  switch (values.type) {
    case SubscriptionType.SINGLE: {
      if (values.trainingType === TrainingType.YOGA || values.trainingType === TrainingType.PERSONAL) {
        return {
          type: values.type,
          trainingType: values.trainingType,
          start: values.start,
          end: values.start,
          trainingsLeft: values.trainingsLeft,
          ...(values.paid && { paidAt: values.paidAt }),
        };
      }

      throw new Error('invalid combination of training and subscription');
    }
    case SubscriptionType.LIMITED_10: {
      if (values.trainingType === TrainingType.YOGA || values.trainingType === TrainingType.PERSONAL) {
        return {
          type: values.type,
          trainingType: values.trainingType,
          start: values.start,
          end: getEndDate(values.start, { months: 3 }),
          trainingsLeft: values.trainingsLeft,
          ...(values.paid && { paidAt: values.paidAt }),
        };
      }

      throw new Error('invalid combination of training and subscription');
    }
    case SubscriptionType.LIMITED_20: {
      if (values.trainingType === TrainingType.YOGA) {
        return {
          type: values.type,
          trainingType: values.trainingType,
          start: values.start,
          end: getEndDate(values.start, { months: 6 }),
          trainingsLeft: values.trainingsLeft,
          ...(values.paid && { paidAt: values.paidAt }),
        };
      }

      throw new Error('invalid combination of training and subscription');
    }
    case SubscriptionType.UNLIMITED_10: {
      if (values.trainingType === TrainingType.YOGA) {
        return {
          type: values.type,
          trainingType: values.trainingType,
          start: values.start,
          trainingsLeft: values.trainingsLeft,
          ...(values.paid && { paidAt: values.paidAt }),
        };
      }

      throw new Error('invalid combination of training and subscription');
    }
    case SubscriptionType.BLOCK: {
      if (values.trainingType === TrainingType.HIIT || values.trainingType === TrainingType.BOOST) {
        return {
          type: values.type,
          trainingType: values.trainingType,
          start: values.start,
          end: getEndDate(values.start, { weeks: 6 }),
          ...(values.paid && { paidAt: values.paidAt }),
        };
      }

      throw new Error('invalid combination of training and subscription');
    }
  }
}

const SubscriptionFormFields: React.FC<Props> = ({ disabled, namespace }) => {
  const withNamespace = (name: string) => (namespace ? `${namespace}.${name}` : name);

  // this is not very type safe but good enough for now
  const { values, setFieldValue } = useFormikContext();
  const trainingType = getIn(values, withNamespace('trainingType')) as TrainingType;
  const type = getIn(values, withNamespace('type')) as SubscriptionType;
  const trainingsLeft = getIn(values, withNamespace('trainingsLeft')) as number;
  const paid = getIn(values, withNamespace('paid')) as boolean;

  const validTypes = validSubscriptionTypes[trainingType];
  if (!validTypes.includes(type)) {
    setFieldValue(withNamespace('type'), validTypes[0]);
  }

  const defaultTrainingsLeft = getDefaultTrainingsLeft(type);
  if (trainingsLeft > defaultTrainingsLeft) {
    setFieldValue(withNamespace('trainingsLeft'), defaultTrainingsLeft);
  }

  return (
    <>
      <FormField
        label="Trainings-Typ"
        error={<ErrorMessage name={withNamespace('trainingType')} />}
        control={
          <div className="select">
            <Field as="select" name={withNamespace('trainingType')}>
              {Object.keys(validSubscriptionTypes).map(trainingType => (
                <option key={trainingType} value={trainingType}>
                  {getTrainingName(trainingType as TrainingType)}
                </option>
              ))}
            </Field>
          </div>
        }
      />
      <FormField
        label="Abo-Typ"
        error={<ErrorMessage name={withNamespace('type')} />}
        control={
          <div className="select">
            <Field as="select" name={withNamespace('type')}>
              {validSubscriptionTypes[trainingType].map(type => (
                <option key={type} value={type}>
                  {getSubscriptionName(type)}
                </option>
              ))}
            </Field>
          </div>
        }
      />
      {type !== SubscriptionType.BLOCK && (
        <FormField
          label="Anzahl Trainings übrig"
          error={<ErrorMessage name={withNamespace('trainingsLeft')} />}
          control={<Field className="input" type="number" name={withNamespace('trainingsLeft')} disabled={disabled} />}
        />
      )}
      <FormField
        label="Startpunkt"
        error={<ErrorMessage name={withNamespace('start')} />}
        control={<Field className="input" type="date" name={withNamespace('start')} disabled={disabled} />}
      />
      <FormField
        label="Kosten"
        error={<ErrorMessage name={withNamespace('paid')} />}
        control={
          <>
            <Field className="checkbox" type="checkbox" name={withNamespace('paid')} disabled={disabled} />
            {' Bereits bezahlt'}
          </>
        }
      />
      {paid && (
        <FormField
          label="Bezahlt am"
          error={<ErrorMessage name={withNamespace('paidAt')} />}
          control={<Field className="input" type="date" name={withNamespace('paidAt')} disabled={disabled} />}
        />
      )}
    </>
  );
};

export default SubscriptionFormFields;
