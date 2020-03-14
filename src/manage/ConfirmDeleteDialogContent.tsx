import React from 'react';
import { Button } from '../common/components/Button';
import { DialogBody, DialogFooter, DialogHeader } from '../common/components/Dialog';

export interface Props {
  name: string;
  onDeleteClick: React.MouseEventHandler;
  onCancelClick: React.MouseEventHandler;
}

const ConfirmDeleteDialogContent: React.FC<Props> = ({ name, onDeleteClick, onCancelClick }) => (
  <>
    <DialogHeader title="Löschen bestätigen" onCloseClick={onCancelClick} />
    <DialogBody>
      <p className="p-4">{`Bist du sicher, dass du ${name} löschen möchtest?`}</p>
    </DialogBody>
    <DialogFooter>
      <div className="flex justify-end p-4">
        <Button onClick={onCancelClick}>Abbrechen</Button>
        <Button className="ml-2" color="red" onClick={onDeleteClick}>
          Löschen
        </Button>
      </div>
    </DialogFooter>
  </>
);

export default ConfirmDeleteDialogContent;
