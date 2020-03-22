import { ErrorMessage, Field } from 'formik';
import React from 'react';
import { TrainingInput } from '../../../shared';
import { FormField } from '../../common/components/Forms';
import TrainingFormFields, { Props } from './TrainingFormFields';

export interface SessionFormValues extends TrainingInput {
  notes: string;
}

const SessionFormFields: React.FC<Props> = ({ clients, disabled }) => (
  <>
    <TrainingFormFields clients={clients} disabled={disabled} />
    <FormField
      className="mt-3"
      label="Notizen"
      htmlFor="notes"
      error={<ErrorMessage name="notes" />}
      control={
        <Field className="w-full form-textarea" as="textarea" type="text" id="notes" name="notes" disabled={disabled} />
      }
    />
  </>
);

export default SessionFormFields;
