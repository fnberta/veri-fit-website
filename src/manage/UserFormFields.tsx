import { Field, FormikErrors } from 'formik';
import React from 'react';
import { FormField, HorizontalField } from '../components/bulma/Forms';
import { makeValidator } from '../utils/forms';
import { UserInput } from './UserRepository';

export interface Props {
  errors: FormikErrors<UserInput>;
  birthdayMax: string;
  disabled: boolean;
}

const UserFormFields: React.FC<Props> = ({ errors, birthdayMax, disabled }) => (
  <>
    <HorizontalField label="Name">
      <FormField
        icon="fas fa-user"
        error={errors.name}
        control={
          <Field
            className="input"
            aria-label="Name"
            type="text"
            name="name"
            placeholder="Name"
            validate={makeValidator('Name')}
            disabled={disabled}
          />
        }
      />
    </HorizontalField>
    <HorizontalField label="Geburtstag">
      <FormField
        icon="fas fa-birthday-cake"
        error={errors.birthday}
        control={
          <Field
            className="input"
            aria-label="Geburtstag"
            type="date"
            name="birthday"
            placeholder="Geburtstag"
            max={birthdayMax}
            validate={makeValidator('Geburtstag')}
            disabled={disabled}
          />
        }
      />
    </HorizontalField>
    <HorizontalField label="Kontakt">
      <FormField
        icon="fas fa-envelope"
        error={errors.email}
        control={
          <Field
            className="input"
            aria-label="Email"
            type="email"
            name="email"
            placeholder="Email"
            validate={makeValidator('Email')}
            disabled={disabled}
          />
        }
      />
    </HorizontalField>
    <HorizontalField label="">
      <FormField
        icon="fas fa-phone"
        error={errors.phone}
        control={
          <Field
            className="input"
            aria-label="Telefon"
            type="tel"
            name="phone"
            placeholder="Telefon"
            validate={makeValidator('Telefon')}
            disabled={disabled}
          />
        }
      />
    </HorizontalField>
    <HorizontalField label="Adresse">
      <FormField
        icon="fas fa-map-marker"
        error={errors.address && errors.address.street}
        control={
          <Field
            className="input"
            aria-label="Strasse"
            type="text"
            name="address.street"
            placeholder="Strasse"
            validate={makeValidator('Strasse')}
            disabled={disabled}
          />
        }
      />
      <FormField
        short={true}
        error={errors.address && errors.address.number}
        control={
          <Field
            className="input"
            aria-label="Hausnummer"
            type="number"
            name="address.number"
            placeholder="Hausnummer"
            validate={makeValidator('Hausnummer')}
            disabled={disabled}
          />
        }
      />
    </HorizontalField>
    <HorizontalField label="">
      <FormField
        short={true}
        error={errors.address && errors.address.zip}
        control={
          <Field
            className="input"
            aria-label="PLZ"
            type="text"
            name="address.zip"
            placeholder="PLZ"
            validate={makeValidator('PLZ')}
            disabled={disabled}
          />
        }
      />
      <FormField
        icon="fas fa-city"
        error={errors.address && errors.address.city}
        control={
          <Field
            className="input"
            aria-label="Stadt"
            type="text"
            name="address.city"
            placeholder="Stadt"
            validate={makeValidator('Stadt')}
            disabled={disabled}
          />
        }
      />
    </HorizontalField>
  </>
);

export default UserFormFields;
