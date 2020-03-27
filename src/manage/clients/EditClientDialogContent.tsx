import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { Client } from '../../../shared';
import { Button } from '../../common/components/Button';
import { DialogBody, DialogFooter, DialogHeader } from '../../common/components/Dialog';
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

const EditClientDialogContent: React.FC<Props> = ({ client, onClientUpdated, onCancelClick }) => {
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
            <DialogBody>
              <Form>
                <ClientFormFields disabled={isSubmitting} />
              </Form>
            </DialogBody>
            <DialogFooter>
              <div className="flex justify-end p-4">
                <Button disabled={isSubmitting} onClick={onCancelClick}>
                  Verwerfen
                </Button>
                <Button
                  className="ml-2"
                  type="submit"
                  color="orange"
                  loading={isSubmitting}
                  disabled={!dirty || !isValid}
                  onClick={submitForm}
                >
                  Speichern
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </Formik>
    </>
  );
};

export default EditClientDialogContent;
