import React from 'react';
import Button from '../components/bulma/Button';
import Dialog from '../components/bulma/Dialog';

export interface Props {
  name: string;
  onDeleteClick: React.MouseEventHandler;
  onCancelClick: React.MouseEventHandler;
}

const ConfirmDeleteDialog: React.FC<Props> = ({ name, onDeleteClick, onCancelClick }) => (
  <Dialog
    title="Löschen bestätigen"
    body={<p>{`Bist du sicher, dass du ${name} löschen möchtest?`}</p>}
    footer={
      <>
        <Button text="Löschen" intent="danger" onClick={onDeleteClick} />
        <Button text="Abbrechen" onClick={onCancelClick} />
      </>
    }
    onCloseClick={() => onCancelClick}
  />
);

export default ConfirmDeleteDialog;
