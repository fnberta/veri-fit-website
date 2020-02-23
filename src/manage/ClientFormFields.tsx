import { ErrorMessage, Field, FormikErrors } from 'formik';
import React from 'react';
import { FormField } from '../components/Forms';
import { makeValidator } from '../utils/forms';
import { getToday, isValidISOString } from './dateTime';
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

  if (values.birthday.length > 0 && !isValidISOString(values.birthday)) {
    errors.birthday = 'Datumsformat muss YYYY-MM-DD sein';
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
    <div className="p-4">
      <h2 className="text-base font-semibold">Persönlich</h2>
      <div className="mt-4">
        <FormField
          label="Name"
          htmlFor="name"
          icon="fas fa-user"
          error={<ErrorMessage name="name" />}
          control={
            <Field
              className="form-input w-full"
              type="text"
              id="name"
              name="name"
              placeholder="Yoga Gott"
              validate={makeValidator('Name')}
              disabled={disabled}
            />
          }
        />
        <FormField
          className="mt-3"
          label="Geburtstag"
          htmlFor="birthday"
          icon="fas fa-birthday-cake"
          error={<ErrorMessage name="birthday" />}
          control={
            <Field
              className="form-input w-full"
              type="date"
              id="birthday"
              name="birthday"
              max={getToday()}
              disabled={disabled}
            />
          }
        />
      </div>
    </div>
    <hr className="my-2" />
    <div className="p-4">
      <h2 className="text-base font-semibold">Kontakt</h2>
      <div className="mt-4">
        <FormField
          label="Email"
          icon="fas fa-envelope"
          error={<ErrorMessage name="email" />}
          control={<Field className="form-input w-full" type="email" name="email" disabled={disabled} />}
        />
        <FormField
          className="mt-2"
          label="Telefon"
          icon="fas fa-phone"
          error={<ErrorMessage name="phone" />}
          control={<Field className="form-input w-full" type="tel" name="phone" disabled={disabled} />}
        />
        <div className="mt-2 flex">
          <FormField
            className="flex-1"
            label="Strasse"
            icon="fas fa-map-marker"
            error={<ErrorMessage name="address.street" />}
            control={<Field className="form-input w-full" type="text" name="address.street" disabled={disabled} />}
          />
          <FormField
            className="ml-2 w-1/3"
            label="Hausnummer"
            error={<ErrorMessage name="address.number" />}
            control={<Field className="form-input w-full" type="text" name="address.number" disabled={disabled} />}
          />
        </div>
        <div className="mt-2 flex">
          <FormField
            className="w-1/3"
            label="PLZ"
            error={<ErrorMessage name="address.zip" />}
            control={<Field className="form-input w-full" type="text" name="address.zip" disabled={disabled} />}
          />
          <FormField
            className="ml-2 flex-1"
            label="Stadt"
            icon="fas fa-city"
            error={<ErrorMessage name="address.city" />}
            control={<Field className="form-input w-full" type="text" name="address.city" disabled={disabled} />}
          />
        </div>
      </div>
    </div>
  </>
);

export default ClientFormFields;
