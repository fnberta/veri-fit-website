import React from 'react';
import { Button } from '@veri-fit/common-ui';
import { DialogFooter, DialogHeader } from './Dialog';

export interface Props {
  name: string;
  onDeleteClick: React.MouseEventHandler;
  onCancelClick: React.MouseEventHandler;
}

const ConfirmDeleteDialogContent: React.FC<Props> = ({ name, onDeleteClick, onCancelClick }) => (
  <>
    <DialogHeader title="Löschen bestätigen" onCloseClick={onCancelClick} />
    <p className="dialog-body p-4">{`Bist du sicher, dass du ${name} löschen möchtest?`}</p>
    <DialogFooter className="flex justify-end p-4 space-x-2">
      <Button onClick={onCancelClick}>Abbrechen</Button>
      <Button color="red" onClick={onDeleteClick}>
        Löschen
      </Button>
    </DialogFooter>
  </>
);

export default ConfirmDeleteDialogContent;
