import React, { useEffect } from 'react';
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
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
        <span className="absolute w-full h-full bg-gray-900 opacity-75 pointer-events-none" />
        <div className="relative w-full max-w-md max-h-full h-full md:h-auto bg-white md:rounded shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-100 flex justify-between items-center border-b">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <button className="btn btn-medium" aria-label="Schliessen" onClick={onCloseClick}>
              <span className="fas fa-times" />
            </button>
          </div>
          <div className="overflow-auto border-b flex-grow">{body}</div>
          <div className="bg-gray-100">{footer}</div>
        </div>
      </div>
    </Portal>
  );
};

export default Dialog;
