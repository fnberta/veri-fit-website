import React from 'react';
import { Button } from '../components/Button';
import Dialog from '../components/Dialog';

export interface Props {
  name: string;
  onDeleteClick: React.MouseEventHandler;
  onCancelClick: React.MouseEventHandler;
}

const ConfirmDeleteDialog: React.FC<Props> = ({ name, onDeleteClick, onCancelClick }) => (
  <Dialog
    title="Löschen bestätigen"
    body={<p className="p-4">{`Bist du sicher, dass du ${name} löschen möchtest?`}</p>}
    footer={
      <div className="flex justify-end p-4">
        <Button onClick={onCancelClick}>Abbrechen</Button>
        <Button className="ml-2" color="red" onClick={onDeleteClick}>
          Löschen
        </Button>
      </div>
    }
    onCloseClick={() => onCancelClick}
  />
);

export default ConfirmDeleteDialog;
