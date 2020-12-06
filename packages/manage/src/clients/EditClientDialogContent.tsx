import { Form, Formik, FormikHelpers } from 'formik';
import React, { FC } from 'react';
import { Client } from '@veri-fit/common';
import { Button } from '@veri-fit/common-ui';
import { DialogFooter, DialogHeader } from '../Dialog';
import { useRepos } from '../repositories/RepoContext';
import ClientFormFields, { ClientFormValues, getClientInput, validateClientForm } from './ClientFormFields';

export interface Props {
  client: Client;
  onClientUpdated: (client: Client) => void;
  onCancelClick: () => void;
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

const EditClientDialogContent: FC<Props> = ({ client, onClientUpdated, onCancelClick }) => {
  const { clientRepo } = useRepos();

  async function handleFormSubmission(values: ClientFormValues, { setSubmitting }: FormikHelpers<ClientFormValues>) {
    const updatedClient = await clientRepo.update(client.id, getClientInput(values));
    setSubmitting(false);
    onClientUpdated(updatedClient);
  }

  return (
    <>
      <DialogHeader title={`${client.name} bearbeiten`} onCloseClick={onCancelClick} />
      <Formik<ClientFormValues>
        initialValues={getInitialValues(client)}
        validate={validateClientForm}
        onSubmit={handleFormSubmission}
      >
        {({ dirty, isSubmitting, isValid, submitForm }) => (
          <>
            <Form className="dialog-body">
              <ClientFormFields disabled={isSubmitting} />
            </Form>
            <DialogFooter className="flex justify-end p-4 space-x-2">
              <Button disabled={isSubmitting} onClick={onCancelClick}>
                Verwerfen
              </Button>
              <Button
                type="submit"
                colorScheme="orange"
                loading={isSubmitting}
                disabled={!dirty || !isValid}
                onClick={submitForm}
              >
                Speichern
              </Button>
            </DialogFooter>
          </>
        )}
      </Formik>
    </>
  );
};

export default EditClientDialogContent;
