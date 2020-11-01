import React from 'react';
import { TrainingInput } from '@veri-fit/common';
import { TextAreaField } from '@veri-fit/common-ui';
import TrainingFormFields, { Props } from './TrainingFormFields';

export interface SessionFormValues extends TrainingInput {
  notes: string;
}

const SessionFormFields: React.FC<Props> = ({ clients, disabled }) => (
  <>
    <TrainingFormFields clients={clients} disabled={disabled} />
    <TextAreaField type="text" name="notes" disabled={disabled} label="Notizen" />
  </>
);

export default SessionFormFields;
