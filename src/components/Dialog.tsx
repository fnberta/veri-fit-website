import React, { useEffect } from 'react';
import { IconButton } from './Button';
import Portal from './Portal';

export interface Props {
  title: string;
  body: React.ReactNode;
  footer: React.ReactNode;
  onCloseClick: () => void;
}

const Dialog: React.FC<Props> = ({ title, body, footer, onCloseClick }) => {
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
      <aside className="fixed inset-0 sm:p-4 flex items-center justify-center overflow-hidden">
        <span className="absolute inset-0 bg-gray-900 opacity-75 pointer-events-none" />
        <div className="relative w-full sm:max-w-lg max-h-full h-full sm:h-auto bg-white sm:rounded shadow-xl overflow-hidden flex flex-col">
          <header className="p-4 bg-gray-100 flex justify-between items-center">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <IconButton
              className="hover:bg-gray-200 active:bg-gray-400"
              color="none"
              icon="fa-times"
              title="Schliessen"
              aria-label="Schliessen"
              onClick={onCloseClick}
            />
          </header>
          <div className="overflow-auto flex-grow">{body}</div>
          <div className="bg-gray-100">{footer}</div>
        </div>
      </aside>
    </Portal>
  );
};

export default Dialog;
