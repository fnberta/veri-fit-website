import { ErrorMessage, Field } from 'formik';
import React from 'react';
import { FormField } from '../components/bulma/Forms';
import { makeValidator } from '../utils/forms';
import { getToday } from './dateTime';

export interface Props {
  disabled: boolean;
}

const ClientFormFields: React.FC<Props> = ({ disabled }) => (
  <>
    <FormField
      label="Name"
      icon="fas fa-user"
      error={<ErrorMessage name="name" />}
      control={<Field className="input" type="text" name="name" validate={makeValidator('Name')} disabled={disabled} />}
    />
    <FormField
      label="Geburtstag"
      icon="fas fa-birthday-cake"
      error={<ErrorMessage name="birthday" />}
      control={<Field className="input" type="date" name="birthday" max={getToday()} disabled={disabled} />}
    />
    <FormField
      label="Email"
      icon="fas fa-envelope"
      error={<ErrorMessage name="email" />}
      control={<Field className="input" type="email" name="email" disabled={disabled} />}
    />
    <FormField
      label="Telefon"
      icon="fas fa-phone"
      error={<ErrorMessage name="phone" />}
      control={
        <Field className="input" type="tel" name="phone" validate={makeValidator('Telefon')} disabled={disabled} />
      }
    />
    <div>
      <FormField
        label="Strasse"
        icon="fas fa-map-marker"
        error={<ErrorMessage name="address.street" />}
        control={<Field className="input" type="text" name="address.street" disabled={disabled} />}
      />
      <FormField
        label="Hausnummer"
        error={<ErrorMessage name="address.number" />}
        control={<Field className="input" type="number" name="address.number" disabled={disabled} />}
      />
    </div>
    <FormField
      label="PLZ"
      error={<ErrorMessage name="address.zip" />}
      control={<Field className="input" type="text" name="address.zip" disabled={disabled} />}
    />
    <FormField
      label="Stadt"
      icon="fas fa-city"
      error={<ErrorMessage name="address.city" />}
      control={<Field className="input" type="text" name="address.city" disabled={disabled} />}
    />
  </>
);

export default ClientFormFields;
