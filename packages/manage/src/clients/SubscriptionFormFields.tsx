import { FormikErrors, getIn, useFormikContext } from 'formik';
import React, { FC, useEffect, useRef } from 'react';
import { SubscriptionType, TrainingType } from '@veri-fit/common';
import { CheckInput, FieldControl, InputField, SelectField } from '@veri-fit/common-ui';
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

const SubscriptionFormFields: FC<Props> = ({ trainingTypes, namespace, disabled }) => {
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
      <SelectField name={withNamespace('trainingType')} label="Trainings-Typ">
        {trainingTypes.map((trainingType) => (
          <option key={trainingType} value={trainingType}>
            {getTrainingName(trainingType as TrainingType)}
          </option>
        ))}
      </SelectField>
      <div className="flex space-x-2">
        <SelectField className="w-2/3" label="Abo-Typ" name={withNamespace('type')}>
          {validSubscriptionTypes[trainingType].map((type) => (
            <option key={type} value={type}>
              {getSubscriptionName(type)}
            </option>
          ))}
        </SelectField>
        {type !== SubscriptionType.BLOCK && (
          <InputField
            className="flex-1"
            type="number"
            name={withNamespace('trainingsLeft')}
            disabled={disabled}
            label="Trainings übrig"
          />
        )}
      </div>
      <InputField type="date" name={withNamespace('start')} disabled={disabled} label="Startpunkt" />
      <FieldControl name={withNamespace('paid')}>
        <fieldset className="form-field">
          <legend className="field-label">Kosten</legend>
          <CheckInput type="checkbox" name={withNamespace('paid')} disabled={disabled} label={' Bereits bezahlt'} />
        </fieldset>
      </FieldControl>
      {paid && <InputField type="date" name={withNamespace('paidAt')} disabled={disabled} label="Bezahlt am" />}
    </>
  );
};

export default SubscriptionFormFields;
