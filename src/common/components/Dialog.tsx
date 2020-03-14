import React, { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { IconButton } from './Button';
import Portal from './Portal';
import cx from 'classnames';

export interface Props extends React.HTMLProps<HTMLDivElement> {
  open: boolean;
  onCloseClick: () => void;
}

const Dialog: React.FC<Props> = ({ open, onCloseClick, children, className, ...rest }) => {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseClick();
      }
    }

    window.document.addEventListener('keydown', handleKeyDown);
    return () => window.document.removeEventListener('keydown', handleKeyDown);
  });

  useEffect(() => {
    document.documentElement.classList.add('overflow-hidden');
    return () => document.documentElement.classList.remove('overflow-hidden');
  }, []);

  return (
    <Portal>
      <CSSTransition in={open} timeout={200} unmountOnExit={true} classNames="dialog-transition">
        <aside
          className={cx('fixed inset-0 sm:p-4 flex items-center justify-center overflow-hidden', className)}
          {...rest}
        >
          <span className="absolute inset-0 bg-gray-900 pointer-events-none opacity-75 transition-opacity duration-200" />
          <div className="relative w-full sm:max-w-lg max-h-full h-full sm:h-auto bg-white sm:rounded shadow-xl overflow-hidden flex flex-col transition-all duration-200 transform scale-100">
            {children}
          </div>
        </aside>
      </CSSTransition>
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
    <h1 className="text-2xl font-semibold">{title}</h1>
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
