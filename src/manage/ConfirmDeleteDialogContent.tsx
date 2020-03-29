import React from 'react';
import { Button } from '../common/components/Button';
import { DialogFooter, DialogHeader } from '../common/components/Dialog';

export interface Props {
  name: string;
  onDeleteClick: React.MouseEventHandler;
  onCancelClick: React.MouseEventHandler;
}

const ConfirmDeleteDialogContent: React.FC<Props> = ({ name, onDeleteClick, onCancelClick }) => (
  <>
    <DialogHeader title="Löschen bestätigen" onCloseClick={onCancelClick} />
    <p className="dialog-body p-4">{`Bist du sicher, dass du ${name} löschen möchtest?`}</p>
    <DialogFooter className="flex justify-end p-4">
      <Button onClick={onCancelClick}>Abbrechen</Button>
      <Button className="ml-2" color="red" onClick={onDeleteClick}>
        Löschen
      </Button>
    </DialogFooter>
  </>
);

export default ConfirmDeleteDialogContent;
