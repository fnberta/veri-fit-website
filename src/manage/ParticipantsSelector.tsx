import { useField } from 'formik';
import React from 'react';
import { Client } from '../../shared';

export interface Props {
  name: string;
  clients: Client[];
}

const MAX_PARTICIPANTS_SIZE = 5;

const ParticipantsSelector: React.FC<Props> = ({ name, clients }) => {
  const [field, meta, { setValue }] = useField(name);
  return (
    <div className="select is-multiple">
      <select
        name="participants"
        aria-label="Teilnehmer"
        multiple={true}
        size={clients.length > MAX_PARTICIPANTS_SIZE ? MAX_PARTICIPANTS_SIZE : clients.length}
        value={meta.value}
        onBlur={field.onBlur}
        onChange={e => setValue(Array.from(e.currentTarget.selectedOptions).map(option => option.value))}
      >
        {clients.map(client => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ParticipantsSelector;