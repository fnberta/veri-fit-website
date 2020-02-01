import styled from '@emotion/styled';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { ChangeType, Client, Session, TrainingInput } from '../../shared';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';
import { useRepos } from './repositories/RepoContext';
import TrainingFormFields from './TrainingFormFields';

export interface Props {
  session: Session;
  clients: Client[];
  onSessionChanged: (session: Session) => void;
  onCancelClick: React.MouseEventHandler;
}

const FooterLayout = styled.div({
  flex: '1',
  display: 'flex',
  justifyContent: 'space-between',
});

function getInitialValues(session: Session): TrainingInput {
  return {
    type: session.type,
    weekday: session.weekday,
    time: session.time,
    clientIds: session.clientIds,
  };
}

const EditSessionDialog: React.FC<Props> = ({ session, clients, onSessionChanged, onCancelClick }) => {
  const [changeType, setChangeType] = useState(ChangeType.SINGLE);
  const { sessionRepo } = useRepos();

  async function handleFormSubmission(values: TrainingInput, { setSubmitting }: FormikHelpers<TrainingInput>) {
    const changedSession = await sessionRepo.update(changeType, session, values);
    setSubmitting(false);
    onSessionChanged(changedSession);
  }

  return (
    <Formik<TrainingInput> onSubmit={handleFormSubmission} initialValues={getInitialValues(session)}>
      {({ isValid, isSubmitting, submitForm }) => (
        <Dialog
          title="Training bearbeiten"
          body={
            <Form>
              <TrainingFormFields clients={clients} disabled={isSubmitting} />
            </Form>
          }
          footer={
            <FooterLayout>
              <div className="select">
                {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                <select
                  title="Änderungsart"
                  value={changeType}
                  disabled={isSubmitting}
                  onChange={e => setChangeType(e.currentTarget.value as ChangeType)}
                >
                  <option value={ChangeType.SINGLE}>Nur diese</option>
                  <option value={ChangeType.ALL_FOLLOWING}>Alle zukünftigen</option>
                  <option value={ChangeType.ALL_NON_CONFIRMED}>Alle offenen</option>
                </select>
              </div>
              <div>
                <Button text="Verwerfen" disabled={isSubmitting} onClick={onCancelClick} />
                <Button
                  text="Speichern"
                  type="submit"
                  intent="primary"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  onClick={submitForm}
                />
              </div>
            </FooterLayout>
          }
          onCloseClick={onCancelClick}
        />
      )}
    </Formik>
  );
};

export default EditSessionDialog;
