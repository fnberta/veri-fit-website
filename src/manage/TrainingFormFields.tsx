import { ErrorMessage, Field } from 'formik';
import React from 'react';
import { Client, TrainingType } from '../../shared';
import { FormField } from '../components/bulma/Forms';
import { getTrainingName } from './displayNames';
import ParticipantsSelector from './ParticipantsSelector';
import { validSubscriptionTypes } from './subscriptionChecks';

export interface Props {
  clients: Client[];
  disabled: boolean;
}

const TrainingFormFields: React.FC<Props> = ({ clients, disabled }) => (
  <>
    <FormField
      label="Typ"
      error={<ErrorMessage name="type" />}
      control={
        <div className="select">
          <Field as="select" name="type" disabled={disabled}>
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
      label="Wochentag"
      error={<ErrorMessage name="weekday" />}
      control={
        <div className="select">
          <Field as="select" name="weekday" disabled={disabled}>
            <option value={1}>Montag</option>
            <option value={2}>Dienstag</option>
            <option value={3}>Mittwoch</option>
            <option value={4}>Donnerstag</option>
            <option value={5}>Freitag</option>
            <option value={6}>Samstag</option>
            <option value={7}>Sonntag</option>
          </Field>
        </div>
      }
    />
    <FormField
      label="Startzeit"
      error={<ErrorMessage name="time.start" />}
      control={<Field className="input" type="time" name="time.start" placeholder="Startzeit" disabled={disabled} />}
    />
    <FormField
      label="Endzeit"
      error={<ErrorMessage name="time.end" />}
      control={<Field className="input" type="time" name="time.end" placeholder="Endzeit" disabled={disabled} />}
    />
    <FormField
      label="Teilnehmer"
      control={<ParticipantsSelector name="clientIds" clients={clients} disabled={disabled} />}
    />
  </>
);

export default TrainingFormFields;
