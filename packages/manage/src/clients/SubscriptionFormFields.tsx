import { ErrorMessage, Field, FormikErrors, getIn, useFormikContext } from 'formik';
import React, { useEffect, useRef } from 'react';
import { SubscriptionType, TrainingType } from '@veri-fit/common';
import { getEndDate, isValidISOString } from '../dateTime';
import { getSubscriptionName, getTrainingName } from '../displayNames';
import { SubscriptionInput } from '../repositories/ClientRepository';
import { validSubscriptionTypes } from '../subscriptionChecks';

export interface Props {
  trainingTypes: TrainingType[];
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
  } else if (!isValidISOString(values.start)) {
    errors.start = 'Datumsformat muss YYYY-MM-DD sein';
  }

  if (values.trainingsLeft == null) {
    errors.trainingsLeft = 'Trainings übrig ist erforderlich';
  }

  if (values.paid) {
    if (values.paidAt.length === 0) {
      errors.paidAt = 'Bezahlt am ist erforderlich';
    } else if (!isValidISOString(values.paidAt)) {
      errors.start = 'Datumsformat muss YYYY-MM-DD sein';
    }
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

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const SubscriptionFormFields: React.FC<Props> = ({ trainingTypes, namespace, disabled }) => {
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

  // update trainingsLeft when default changes or if value is higher than default
  const defaultTrainingsLeft = getDefaultTrainingsLeft(type);
  const prevDefaultTrainingsLeft = usePrevious(defaultTrainingsLeft);
  if (defaultTrainingsLeft !== prevDefaultTrainingsLeft || trainingsLeft > defaultTrainingsLeft) {
    setFieldValue(withNamespace('trainingsLeft'), defaultTrainingsLeft);
  }

  return (
    <>
      <label className="form-field">
        <span className="form-label">Trainings-Typ</span>
        <Field className="form-select w-full" as="select" name={withNamespace('trainingType')}>
          {trainingTypes.map((trainingType) => (
            <option key={trainingType} value={trainingType}>
              {getTrainingName(trainingType as TrainingType)}
            </option>
          ))}
        </Field>
        <ErrorMessage name={withNamespace('trainingType')}>
          {(error) => <span className="form-error">{error}</span>}
        </ErrorMessage>
      </label>
      <div className="mt-2 flex">
        <label className="form-field w-2/3">
          <span className="form-label">Abo-Typ</span>
          <Field className="form-select" as="select" name={withNamespace('type')}>
            {validSubscriptionTypes[trainingType].map((type) => (
              <option key={type} value={type}>
                {getSubscriptionName(type)}
              </option>
            ))}
          </Field>
          <ErrorMessage name={withNamespace('type')}>
            {(error) => <span className="form-error">{error}</span>}
          </ErrorMessage>
        </label>
        {type !== SubscriptionType.BLOCK && (
          <label className="form-field ml-2 flex-1">
            <span className="form-label">Trainings übrig</span>
            <Field
              className="form-input w-full"
              type="number"
              name={withNamespace('trainingsLeft')}
              disabled={disabled}
            />
            <ErrorMessage name={withNamespace('trainingsLeft')}>
              {(error) => <span className="form-error">{error}</span>}
            </ErrorMessage>
          </label>
        )}
      </div>
      <label className="form-field mt-2">
        <span className="form-label">Startpunkt</span>
        <Field className="form-input w-full" type="date" name={withNamespace('start')} disabled={disabled} />
        <ErrorMessage name={withNamespace('start')}>
          {(error) => <span className="form-error">{error}</span>}
        </ErrorMessage>
      </label>
      <fieldset className="form-field mt-2">
        <legend className="form-label">Kosten</legend>
        <label className="inline-flex items-center">
          <Field className="form-checkbox" type="checkbox" name={withNamespace('paid')} disabled={disabled} />
          <span className="ml-2 text-base">{' Bereits bezahlt'}</span>
        </label>
        <ErrorMessage name={withNamespace('paid')}>
          {(error) => <span className="form-error">{error}</span>}
        </ErrorMessage>
      </fieldset>
      {paid && (
        <label className="form-field mt-2">
          <span className="form-label">Bezahlt am</span>
          <Field className="form-input w-full" type="date" name={withNamespace('paidAt')} disabled={disabled} />
          <ErrorMessage name={withNamespace('paidAt')}>
            {(error) => <span className="form-error">{error}</span>}
          </ErrorMessage>
        </label>
      )}
    </>
  );
};

export default SubscriptionFormFields;
