import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Client } from '../../shared';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { useRepos } from './repositories/RepoContext';
import ClientFormFields from './ClientFormFields';
import { ClientInput } from './repositories/ClientRepository';

export interface Props {
  client: Client;
  onClientUpdated: (client: Client) => void;
  onCancelClick: React.MouseEventHandler;
}

function getInitialValues(client: Client): ClientInput {
  return {
    name: client.name,
    email: client.email,
    birthday: client.birthday,
    address: {
      street: client.address.street,
      number: client.address.number,
      zip: client.address.zip,
      city: client.address.city,
    },
    phone: client.phone,
    activeSubscriptions: client.activeSubscriptions,
  };
}

const EditClientDialog: React.FC<Props> = ({ client, onClientUpdated, onCancelClick }) => {
  const { clientRepo } = useRepos();

  async function handleFormSubmission(values: ClientInput, { setSubmitting }: FormikHelpers<ClientInput>) {
    const updatedClient = await clientRepo.update(client.id, values);
    setSubmitting(false);
    onClientUpdated(updatedClient);
  }

  return (
    <Formik<ClientInput>
      initialValues={getInitialValues(client)}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleFormSubmission}
    >
      {({ dirty, isSubmitting, isValid, submitForm }) => (
        <Dialog
          title={`${client.name} bearbeiten`}
          onCloseClick={onCancelClick}
          body={
            <Form>
              <ClientFormFields disabled={isSubmitting} />
            </Form>
          }
          footer={
            <>
              <Button
                text="Speichern"
                type="submit"
                intent="primary"
                loading={isSubmitting}
                disabled={!dirty || !isValid || isSubmitting}
                onClick={submitForm}
              />
              <Button text="Verwerfen" disabled={isSubmitting} onClick={onCancelClick} />
            </>
          }
        />
      )}
    </Formik>
  );
};

export default EditClientDialog;
