import { ErrorMessage, Field, FormikErrors, useFormikContext } from 'formik';
import { DateTime } from 'luxon';
import React from 'react';
import { Client, TrainingInput, TrainingType } from '../../shared';
import { FormField } from '../components/Forms';
import { isValidISOString } from './dateTime';
import { getTrainingName } from './displayNames';
import ParticipantsSelector from './ParticipantsSelector';
import { validSubscriptionTypes } from './subscriptionChecks';

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
  const { values } = useFormikContext<TrainingInput>();
  return (
    <>
      <FormField
        label="Typ"
        error={<ErrorMessage name="type" />}
        control={
          <Field className="form-select" as="select" name="type" disabled={disabled}>
            {Object.keys(validSubscriptionTypes).map(trainingType => (
              <option key={trainingType} value={trainingType}>
                {getTrainingName(trainingType as TrainingType)}
              </option>
            ))}
          </Field>
        }
      />
      <FormField
        className="mt-3"
        label="Startpunkt"
        error={<ErrorMessage name="runsFrom" />}
        help={`Training findet wöchentlich am ${DateTime.fromISO(values.runsFrom).weekdayLong} statt.`}
        control={<Field className="form-input" type="date" name="runsFrom" disabled={disabled} />}
      />
      <FormField
        className="mt-3"
        label="Startzeit"
        error={<ErrorMessage name="time.start" />}
        control={<Field className="form-input" type="time" name="time.start" disabled={disabled} />}
      />
      <FormField
        className="mt-3"
        label="Endzeit"
        error={<ErrorMessage name="time.end" />}
        control={<Field className="form-input" type="time" name="time.end" disabled={disabled} />}
      />
      <FormField
        className="mt-3"
        label="Teilnehmer"
        control={<ParticipantsSelector name="clientIds" clients={clients} disabled={disabled} />}
      />
    </>
  );
};

export default TrainingFormFields;
