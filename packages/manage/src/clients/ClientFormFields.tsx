import { FormikErrors } from 'formik';
import React, { FC } from 'react';
import { FieldControl, InputField, makeValidator } from '@veri-fit/common-ui';
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

const ClientFormFields: FC<Props> = ({ disabled }) => (
  <>
    <div className="p-4 space-y-6">
      <h2 className="text-base font-semibold">Persönlich</h2>
      <div className="space-y-4">
        <FieldControl name="name">
          <InputField
            type="text"
            placeholder="Yoga Gott"
            disabled={disabled}
            label="Name"
            validate={makeValidator('Name')}
          />
        </FieldControl>
        <FieldControl name="birthday">
          <InputField type="date" max={getToday()} disabled={disabled} label="Geburtstag" />
        </FieldControl>
      </div>
    </div>
    <hr className="my-2" />
    <div className="p-4 space-y-6">
      <h2 className="text-base font-semibold">Kontakt</h2>
      <div className="space-y-4">
        <FieldControl name="email">
          <InputField type="email" disabled={disabled} label="Email" />
        </FieldControl>
        <FieldControl name="phone">
          <InputField type="tel" disabled={disabled} label="Telefon" />
        </FieldControl>
        <div className="flex space-x-2">
          <FieldControl className="flex-1" name="address.street">
            <InputField type="text" disabled={disabled} label="Strasse" />
          </FieldControl>
          <FieldControl className="w-1/3" name="address.number">
            <InputField type="text" disabled={disabled} label="Hausnummer" />
          </FieldControl>
        </div>
        <div className="flex space-x-2">
          <FieldControl className="w-1/3" name="address.zip">
            <InputField type="text" disabled={disabled} label="PLZ" />
          </FieldControl>
          <FieldControl className="flex-1" name="address.city">
            <InputField type="text" disabled={disabled} label="Stadt" />
          </FieldControl>
        </div>
      </div>
    </div>
  </>
);

export default ClientFormFields;
