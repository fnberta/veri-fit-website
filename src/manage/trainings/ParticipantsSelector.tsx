import { useField } from 'formik';
import React from 'react';
import { Client } from '../../../shared';
import cx from 'classnames';

export interface Props extends React.HTMLProps<HTMLSelectElement> {
  name: string;
  clients: Client[];
}

const MAX_PARTICIPANTS_SIZE = 5;

const ParticipantsSelector: React.FC<Props> = ({ name, clients, className, ...rest }) => {
  const [field, meta, { setValue }] = useField(name);
  return (
    <select
      className={cx('form-multiselect', className)}
      name={name}
      multiple={true}
      size={clients.length > MAX_PARTICIPANTS_SIZE ? MAX_PARTICIPANTS_SIZE : clients.length}
      value={meta.value}
      onBlur={field.onBlur}
      onChange={(e) => setValue(Array.from(e.currentTarget.selectedOptions).map((option) => option.value))}
      {...rest}
    >
      {clients.map((client) => (
        <option key={client.id} value={client.id}>
          {client.name}
        </option>
      ))}
    </select>
  );
};

export default ParticipantsSelector;
