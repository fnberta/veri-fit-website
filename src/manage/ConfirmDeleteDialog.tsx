import styled from '@emotion/styled';
import React from 'react';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';

export interface Props {
  name: string;
  onDeleteClick: React.MouseEventHandler;
  onCancelClick: React.MouseEventHandler;
}

const FooterLayout = styled.div({
  flex: '1',
  display: 'flex',
  justifyContent: 'flex-end',
});

const ConfirmDeleteDialog: React.FC<Props> = ({ name, onDeleteClick, onCancelClick }) => (
  <Dialog
    title="Löschen bestätigen"
    body={<p>{`Bist du sicher, dass du ${name} löschen möchtest?`}</p>}
    footer={
      <FooterLayout>
        <Button text="Abbrechen" onClick={onCancelClick} />
        <Button text="Löschen" intent="danger" onClick={onDeleteClick} />
      </FooterLayout>
    }
    onCloseClick={() => onCancelClick}
  />
);

export default ConfirmDeleteDialog;
