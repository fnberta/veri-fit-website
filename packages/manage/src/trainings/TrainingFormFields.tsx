import { ErrorMessage, Field, FormikErrors, useFormikContext } from 'formik';
import { DateTime } from 'luxon';
import React from 'react';
import { Client, TrainingInput, TrainingType } from '@veri-fit/common';
import { isValidISOString } from '../dateTime';
import { getTrainingName } from '../displayNames';
import { validSubscriptionTypes } from '../subscriptionChecks';
import ParticipantsSelector from './ParticipantsSelector';

export interface Props {
  clients: Client[];
  disabled: boolean;
}

export function validateTrainingForm(values: TrainingInput): FormikErrors<TrainingInput> {
  const errors: FormikErrors<TrainingInput> = {};

  if (values.type.length === 0) {
    errors.type = 'Trainingstyp ist erforderlich';
  }

  if (values.runsFrom.length === 0) {
    errors.runsFrom = 'Startpunkt ist erforderlich';
  } else if (!isValidISOString(values.runsFrom)) {
    errors.runsFrom = 'Datumsformat muss YYYY-MM-DD sein';
  }

  const startEntered = values.time.start.length > 0;
  const endEntered = values.time.end.length > 0;
  if (!startEntered || !endEntered) {
    errors.time = {};

    if (!startEntered) {
      errors.time.start = 'Startzeit ist erforderlich';
    } else if (!isValidISOString(values.time.start)) {
      errors.time.start = 'Datumsformat muss YYYY-MM-DD sein';
    }
    if (!endEntered) {
      errors.time.end = 'Endzeit ist erforderlich';
    } else if (!isValidISOString(values.time.end)) {
      errors.time.end = 'Datumsformat muss YYYY-MM-DD sein';
    }
  }

  return errors;
}

const TrainingFormFields: React.FC<Props> = ({ clients, disabled }) => {
  const { values, errors, touched } = useFormikContext<TrainingInput>();
  return (
    <>
      <label className="form-field">
        <span className="form-label">Typ</span>
        <Field className="form-select" as="select" name="type" disabled={disabled}>
          {Object.keys(validSubscriptionTypes).map((trainingType) => (
            <option key={trainingType} value={trainingType}>
              {getTrainingName(trainingType as TrainingType)}
            </option>
          ))}
        </Field>
        <ErrorMessage name="type">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
      </label>
      <label className="form-field mt-3">
        <span className="form-label">Startpunkt</span>
        <Field className="form-input" type="date" name="runsFrom" disabled={disabled} />
        {errors.runsFrom && touched.runsFrom ? (
          <span className="form-error">{errors.runsFrom}</span>
        ) : (
          <span className="text-xs">{`Training findet am ${
            DateTime.fromISO(values.runsFrom).weekdayLong
          } statt.`}</span>
        )}
      </label>
      <label className="form-field mt-3">
        <span className="form-label">Startzeit</span>
        <Field className="form-input" type="time" name="time.start" disabled={disabled} />
        <ErrorMessage name="time.start">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
      </label>
      <label className="form-field mt-3">
        <span className="form-label">Endzeit</span>
        <Field className="form-input" type="time" id="end" name="time.end" disabled={disabled} />
        <ErrorMessage name="time.end">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
      </label>
      <label className="form-field mt-3">
        <span className="form-label">Teilnehmer</span>
        <ParticipantsSelector name="clientIds" clients={clients} disabled={disabled} />
        <ErrorMessage name="clientIds">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
      </label>
    </>
  );
};

export default TrainingFormFields;
