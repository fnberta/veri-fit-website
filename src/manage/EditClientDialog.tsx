import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Client } from '../../shared';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import ClientFormFields, { ClientFormValues, getClientInput, validateClientForm } from './ClientFormFields';
import { useRepos } from './repositories/RepoContext';

export interface Props {
  client: Client;
  onClientUpdated: (client: Client) => void;
  onCancelClick: React.MouseEventHandler;
}

function getInitialValues(client: Client): ClientFormValues {
  return {
    name: client.name,
    email: client.email ?? '',
    birthday: client.birthday ?? '',
    address: client.address ?? {
      street: '',
      number: '',
      city: '',
      zip: '',
    },
    phone: client.phone ?? '',
    activeSubscriptions: client.activeSubscriptions,
  };
}

const EditClientDialog: React.FC<Props> = ({ client, onClientUpdated, onCancelClick }) => {
  const { clientRepo } = useRepos();

  async function handleFormSubmission(values: ClientFormValues, { setSubmitting }: FormikHelpers<ClientFormValues>) {
    const updatedClient = await clientRepo.update(client.id, getClientInput(values));
    setSubmitting(false);
    onClientUpdated(updatedClient);
  }

  return (
    <Formik<ClientFormValues>
      initialValues={getInitialValues(client)}
      validate={validateClientForm}
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
