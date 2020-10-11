import { ErrorMessage, Field } from 'formik';
import React from 'react';
import { TrainingInput } from '@veri-fit/common';
import TrainingFormFields, { Props } from './TrainingFormFields';

export interface SessionFormValues extends TrainingInput {
  notes: string;
}

const SessionFormFields: React.FC<Props> = ({ clients, disabled }) => (
  <>
    <TrainingFormFields clients={clients} disabled={disabled} />
    <label className="form-field mt-3">
      <span className="form-label">Notizen</span>
      <Field className="form-textarea w-full" as="textarea" type="text" name="notes" disabled={disabled} />
      <ErrorMessage name="notes">{(error) => <span className="form-error">{error}</span>}</ErrorMessage>
    </label>
  </>
);

export default SessionFormFields;
