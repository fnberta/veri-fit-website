import { ErrorMessage, Field, FormikErrors } from 'formik';
import React from 'react';
import { makeValidator } from '@veri-fit/common-ui';
import { getToday, isValidISOString } from '../dateTime';
import { ClientInput } from '../repositories/ClientRepository';

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
        <label className="form-field">
          <span className="form-label">Name</span>
          <Field
            className="form-input w-full"
            type="text"
            name="name"
            placeholder="Yoga Gott"
            validate={makeValidator('Name')}
            disabled={disabled}
          />
          <ErrorMessage name="name">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
        </label>
        <label className="form-field mt-3">
          <span className="form-label">Geburtstag</span>
          <Field className="form-input w-full" type="date" name="birthday" max={getToday()} disabled={disabled} />
          <ErrorMessage name="birthday">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
        </label>
      </div>
    </div>
    <hr className="my-2" />
    <div className="p-4">
      <h2 className="text-base font-semibold">Kontakt</h2>
      <div className="mt-4">
        <label className="form-field">
          <span className="form-label">Email</span>
          <Field className="form-input w-full" type="email" name="email" disabled={disabled} />
          <ErrorMessage name="email">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
        </label>
        <label className="form-field mt-2">
          <span className="form-label">Telefon</span>
          <Field className="form-input w-full" type="tel" name="phone" disabled={disabled} />
          <ErrorMessage name="phone">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
        </label>
        <div className="mt-2 flex">
          <label className="form-field flex-1">
            <span className="form-label">Strasse</span>
            <Field className="form-input w-full" type="text" name="address.street" disabled={disabled} />
            <ErrorMessage name="address.street">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
          </label>
          <label className="form-field ml-2 w-1/3">
            <span className="form-label">Hausnummer</span>
            <Field className="form-input w-full" type="text" name="address.number" disabled={disabled} />
            <ErrorMessage name="address.number">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
          </label>
        </div>
        <div className="mt-2 flex">
          <label className="form-field w-1/3">
            <span className="form-label">PLZ</span>
            <Field className="form-input w-full" type="text" name="address.zip" disabled={disabled} />
            <ErrorMessage name="address.zip">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
          </label>
          <label className="form-field ml-2 flex-1">
            <span className="form-label">Stadt</span>
            <Field className="form-input w-full" type="text" name="address.city" disabled={disabled} />
            <ErrorMessage name="address.city">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
          </label>
        </div>
      </div>
    </div>
  </>
);

export default ClientFormFields;
