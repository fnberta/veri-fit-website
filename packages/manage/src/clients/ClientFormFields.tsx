import { FormikErrors } from 'formik';
import React from 'react';
import { makeValidator, InputField } from '@veri-fit/common-ui';
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
    <div className="p-4 space-y-4">
      <h2 className="text-base font-semibold">Persönlich</h2>
      <div className="space-y-3">
        <InputField
          name="name"
          type="text"
          placeholder="Yoga Gott"
          disabled={disabled}
          label="Name"
          validate={makeValidator('Name')}
        />
        <InputField name="birthday" type="date" max={getToday()} disabled={disabled} label="Geburtstag" />
      </div>
    </div>
    <hr className="my-2" />
    <div className="p-4 space-y-4">
      <h2 className="text-base font-semibold">Kontakt</h2>
      <div className="space-y-2">
        <InputField name="email" type="email" disabled={disabled} label="Email" />
        <InputField name="phone" type="tel" disabled={disabled} label="Telefon" />
        <div className="flex space-x-2">
          <InputField className="flex-1" name="address.street" type="text" disabled={disabled} label="Strasse" />
          <InputField className="w-1/3" name="address.number" type="text" disabled={disabled} label="Hausnummer" />
        </div>
        <div className="flex space-x-2">
          <InputField className="w-1/3" name="address.zip" type="text" disabled={disabled} label="PLZ" />
          <InputField className="flex-1" name="address.city" type="text" disabled={disabled} label="Stadt" />
        </div>
      </div>
    </div>
  </>
);

export default ClientFormFields;
