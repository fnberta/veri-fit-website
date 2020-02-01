import { ErrorMessage, Field, FormikErrors } from 'formik';
import React from 'react';
import { FormField } from '../components/bulma/Forms';
import { makeValidator } from '../utils/forms';
import { getToday } from './dateTime';
import { ClientInput } from './repositories/ClientRepository';

export interface Props {
  disabled: boolean;
}

export type ClientFormValues = Required<ClientInput>;

export function validateClientForm(values: ClientFormValues): FormikErrors<ClientFormValues> {
  const errors: FormikErrors<ClientFormValues> = {};

  if (values.name.length === 0) {
    errors.name = 'Name ist erforderlich';
  }

  const streetValid = values.address.street.length > 0;
  const numberValid = values.address.number.length > 0;
  const zipValid = values.address.zip.length > 0;
  const cityValid = values.address.city.length > 0;
  const allValid = streetValid && numberValid && zipValid && cityValid;
  const allNonValid = !streetValid && !numberValid && !zipValid && !cityValid;
  if (allValid || allNonValid) {
    // no-op, leaving out address completely or filling it out completely is fine
  } else {
    // if one piece of the address is entered, the whole address needs to be there
    errors.address = {};
    if (!streetValid) {
      errors.address.street = 'Strasse ist erforderlich';
    }
    if (!numberValid) {
      errors.address.number = 'Strassennummer ist erforderlich';
    }
    if (!zipValid) {
      errors.address.zip = 'PLZ ist erforderlich';
    }
    if (!cityValid) {
      errors.address.city = 'Stadt ist erforderlich';
    }
  }

  return errors;
}

export function getClientInput(values: ClientFormValues): ClientInput {
  const input: ClientInput = {
    name: values.name,
    activeSubscriptions: values.activeSubscriptions,
  };

  if (values.email.length > 0) {
    input.email = values.email;
  }
  if (values.birthday.length > 0) {
    input.birthday = values.birthday;
  }
  if (values.phone.length > 0) {
    input.phone = values.phone;
  }
  // validation ensures that if one piece of address is entered, the whole address is there
  if (values.address.street.length > 0) {
    input.address = values.address;
  }

  return input;
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
      control={<Field className="input" type="tel" name="phone" disabled={disabled} />}
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
        control={<Field className="input" type="text" name="address.number" disabled={disabled} />}
      />
    </div>
    <div>
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
    </div>
  </>
);

export default ClientFormFields;
