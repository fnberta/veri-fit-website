import { FormikErrors, useFormikContext } from 'formik';
import { DateTime } from 'luxon';
import React, { FC, useEffect } from 'react';
import { Client, TrainingInput, TrainingType } from '@veri-fit/common';
import { FieldControl, InputField, SelectField } from '@veri-fit/common-ui';
import { isValidISOString } from '../dateTime';
import { getTrainingName } from '../displayNames';
import { validSubscriptionTypes } from '../subscriptionChecks';

export interface Props {
  clients: Client[];
  disabled: boolean;
}

const MAX_PARTICIPANTS_SIZE = 5;

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
      errors.time.start = 'Zeitformat muss hh-mm sein';
    }
    if (!endEntered) {
      errors.time.end = 'Endzeit ist erforderlich';
    } else if (!isValidISOString(values.time.end)) {
      errors.time.end = 'Zeitformat muss hh-mm sein';
    }
  }

  return errors;
}

const TrainingFormFields: FC<Props> = ({ clients, disabled }) => {
  const { values, setFieldValue } = useFormikContext<TrainingInput>();
  const { start, end } = values.time;

  useEffect(() => {
    if (isValidISOString(start) && !end) {
      setFieldValue('time.end', DateTime.fromISO(start).plus({ hours: 1 }).toLocaleString(DateTime.TIME_24_SIMPLE));
    }
  }, [start, end, setFieldValue]);

  return (
    <>
      <FieldControl name="type">
        <SelectField disabled={disabled} label="Typ">
          {Object.keys(validSubscriptionTypes).map((trainingType) => (
            <option key={trainingType} value={trainingType}>
              {getTrainingName(trainingType as TrainingType)}
            </option>
          ))}
        </SelectField>
      </FieldControl>
      <FieldControl
        name="runsFrom"
        helperText={`Training findet am ${DateTime.fromISO(values.runsFrom).weekdayLong} statt.`}
      >
        <InputField type="date" disabled={disabled} label="Startpunkt" />
      </FieldControl>
      <FieldControl name="time.start">
        <InputField type="time" disabled={disabled} label="Startzeit" />
      </FieldControl>
      <FieldControl name="time.end">
        <InputField type="time" disabled={disabled} label="Endzeit" />
      </FieldControl>
      <FieldControl name="clientIds">
        <SelectField
          label="Teilnehmer"
          multiple={true}
          size={clients.length > MAX_PARTICIPANTS_SIZE ? MAX_PARTICIPANTS_SIZE : clients.length}
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </SelectField>
      </FieldControl>
    </>
  );
};

export default TrainingFormFields;
