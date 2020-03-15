import cx from 'classnames';
import React, { useEffect, useRef } from 'react';
import { IconButton } from './Button';
import Portal from './Portal';
import dialogPolyfill from 'dialog-polyfill';

export interface Props extends React.HTMLProps<HTMLDialogElement> {
  open: boolean;
  onCancel: () => void;
}

const Dialog: React.FC<Props> = ({ open, onCancel, children, className, ...rest }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const { current } = dialogRef;
    if (current) {
      dialogPolyfill.registerDialog(current);
    }
  }, []);

  useEffect(() => {
    function handleCancelEvent() {
      onCancelRef.current();
    }

    const { current } = dialogRef;
    if (current) {
      current.addEventListener('cancel', handleCancelEvent);
    }

    return () => {
      if (current) {
        current.removeEventListener('cancel', handleCancelEvent);
      }
    };
  }, []);

  useEffect(() => {
    const { current } = dialogRef;
    if (!current) {
      return;
    }

    if (open) {
      if (!current.open) {
        current.showModal();
      }
    } else if (current.open) {
      current.close();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add('overflow-hidden');
    } else {
      document.documentElement.classList.remove('overflow-hidden');
    }
    return () => document.documentElement.classList.remove('overflow-hidden');
  }, [open]);

  return (
    <Portal>
      <dialog ref={dialogRef} className={className} aria-labelledby="dialog-header" {...rest}>
        <div className="w-full sm:max-w-lg max-h-full h-full sm:h-auto bg-white sm:rounded shadow-xl overflow-hidden flex flex-col">
          {children}
        </div>
      </dialog>
    </Portal>
  );
};

export default Dialog;

export interface DialogHeaderProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
  onCloseClick: React.MouseEventHandler;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ title, onCloseClick, className, ...rest }) => (
  <header className={cx('relative p-4 bg-gray-100 flex justify-between items-center shadow', className)} {...rest}>
    <h1 id="dialog-header" className="text-2xl font-semibold">
      {title}
    </h1>
    <IconButton
      className="hover:bg-gray-200 active:bg-gray-400"
      color="none"
      icon="x"
      title="Schliessen"
      aria-label="Schliessen"
      onClick={onCloseClick}
    />
  </header>
);

export const DialogBody: React.FC<React.HTMLProps<HTMLDivElement>> = ({ children, className, ...rest }) => (
  <div className={cx('overflow-auto flex-grow', className)} {...rest}>
    {children}
  </div>
);

export const DialogFooter: React.FC<React.HTMLProps<HTMLDivElement>> = ({ children, className, ...rest }) => (
  <div className={cx('bg-gray-100', className)} {...rest}>
    {children}
  </div>
);
