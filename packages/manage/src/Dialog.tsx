import cx from 'classnames';
import React, { ComponentPropsWithoutRef, FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { CloseButton } from '@veri-fit/common-ui';
import Portal from './Portal';

export interface Props extends ComponentPropsWithoutRef<'dialog'> {
  open: boolean;
  onCancel: () => void;
}

const Dialog: FC<Props> = ({ open, onCancel, children, className, ...rest }) => {
  const [registered, setRegistered] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const { current } = dialogRef;
    if (current && !registered) {
      import('dialog-polyfill').then((polyfill) => {
        polyfill.default.registerDialog(current);
        setRegistered(true);
      });
    }
  }, [registered]);

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
    if (!current || !registered) {
      return;
    }

    if (open) {
      if (!current.open) {
        current.showModal();
      }
    } else if (current.open) {
      current.close();
    }
  }, [open, registered]);

  useEffect(() => {
    if (open) {
      window.document.documentElement.classList.add('overflow-hidden');
    } else {
      window.document.documentElement.classList.remove('overflow-hidden');
    }
    return () => window.document.documentElement.classList.remove('overflow-hidden');
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

export interface DialogHeaderProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  onCloseClick: MouseEventHandler;
}

export const DialogHeader: FC<DialogHeaderProps> = ({ title, onCloseClick, className, ...rest }) => (
  <header
    className={cx('relative p-4 flex-shrink-0 bg-gray-100 flex justify-between items-center shadow', className)}
    {...rest}
  >
    <h1 id="dialog-header" className="text-2xl font-semibold">
      {title}
    </h1>
    <CloseButton onClick={onCloseClick} />
  </header>
);

export type FooterProps = ComponentPropsWithoutRef<'div'>;

export const DialogFooter: FC<FooterProps> = ({ children, className, ...rest }) => (
  <footer className={cx('flex-shrink-0 bg-gray-100', className)} {...rest}>
    {children}
  </footer>
);
