import { Field, FormikErrors, useField, useFormikContext } from 'formik';
import React from 'react';
import { SubscriptionType, TrainingType } from '../../shared/interfaces';
import { FormField, HorizontalField } from '../components/bulma/Forms';
import { makeValidator } from '../utils/forms';
import { SubscriptionInput } from './UserRepository';

export interface Props {
  parentName?: string;
  errors: FormikErrors<SubscriptionInput> | undefined;
  disabled: boolean;
}

export function getTrainingName(type: TrainingType): string {
  switch (type) {
    case TrainingType.BOOST:
      return 'BOOST';
    case TrainingType.HIIT:
      return 'HIIT';
    case TrainingType.PERSONAL:
      return 'Personal';
    case TrainingType.YOGA:
      return 'Yoga';
  }
}

export function getSubscriptionName(type: SubscriptionType): string {
  switch (type) {
    case SubscriptionType.UNLIMITED_10:
      return '10er unlimitiert';
    case SubscriptionType.SINGLE:
      return 'Einzeleintritt';
    case SubscriptionType.LIMITED_10:
      return '10er limitiert';
    case SubscriptionType.LIMITED_20:
      return '20er limitiert';
    case SubscriptionType.BLOCK:
      return 'Block';
  }
}

const SubscriptionSelect: React.FC<
  React.HTMLProps<HTMLSelectElement> & { name: string; category: TrainingType }
> = props => {
  const [field, meta] = useField(props);
  const { category } = props;
  return (
    <HorizontalField label="">
      <FormField
        error={meta.error}
        control={
          <div className="select">
            <select {...field} {...props}>
              {category === TrainingType.YOGA ? (
                <>
                  <option value={SubscriptionType.LIMITED_10}>
                    {getSubscriptionName(SubscriptionType.LIMITED_10)}
                  </option>
                  <option value={SubscriptionType.LIMITED_20}>
                    {getSubscriptionName(SubscriptionType.LIMITED_20)}
                  </option>
                  <option value={SubscriptionType.UNLIMITED_10}>
                    {getSubscriptionName(SubscriptionType.UNLIMITED_10)}
                  </option>
                  <option value={SubscriptionType.SINGLE}>{getSubscriptionName(SubscriptionType.SINGLE)}</option>
                </>
              ) : category === TrainingType.HIIT || category === TrainingType.BOOST ? (
                <option value={SubscriptionType.BLOCK}>{getSubscriptionName(SubscriptionType.BLOCK)}</option>
              ) : (
                <>
                  <option value={SubscriptionType.LIMITED_10}>
                    {getSubscriptionName(SubscriptionType.LIMITED_10)}
                  </option>
                  <option value={SubscriptionType.LIMITED_20}>
                    {getSubscriptionName(SubscriptionType.LIMITED_20)}
                  </option>
                  <option value={SubscriptionType.SINGLE}>{getSubscriptionName(SubscriptionType.SINGLE)}</option>
                </>
              )}
            </select>
          </div>
        }
      />
    </HorizontalField>
  );
};

const SubscriptionFormFields: React.FC<Props> = ({ errors, disabled, parentName }) => {
  const prefix = parentName != null ? `${parentName}.` : '';
  const { values } = useFormikContext();
  const category = (parentName != null ? values[parentName].category : values.category) as TrainingType;

  return (
    <>
      <HorizontalField label="Abo">
        <FormField
          error={errors && errors.category}
          control={
            <div className="select">
              <Field as="select" aria-label="Abo-Typ" name={`${prefix}category`}>
                <option value={TrainingType.YOGA}>{getTrainingName(TrainingType.YOGA)}</option>
                <option value={TrainingType.BOOST}>{getTrainingName(TrainingType.BOOST)}</option>
                <option value={TrainingType.HIIT}>{getTrainingName(TrainingType.HIIT)}</option>
                <option value={TrainingType.PERSONAL}>{getTrainingName(TrainingType.PERSONAL)}</option>
              </Field>
            </div>
          }
        />
      </HorizontalField>
      <SubscriptionSelect aria-label="Abo-Typ" name={`${prefix}type`} category={category} />
      <HorizontalField label="">
        <FormField
          help="Startpunkt des Abos"
          error={errors && errors.start}
          control={
            <Field
              className="input"
              aria-label="Startpunkt"
              type="date"
              name={`${prefix}start`}
              placeholder="Startpunkt"
              validate={makeValidator('Startpunkt')}
              disabled={disabled}
            />
          }
        />
      </HorizontalField>
      <HorizontalField label="">
        <FormField
          error={errors && errors.paid}
          control={
            <label className="checkbox">
              <Field
                className="checkbox"
                aria-label="bezahlt"
                type="checkbox"
                name={`${prefix}paid`}
                disabled={disabled}
              />
              {' Bezahlt'}
            </label>
          }
        />
      </HorizontalField>
    </>
  );
};

export default SubscriptionFormFields;
