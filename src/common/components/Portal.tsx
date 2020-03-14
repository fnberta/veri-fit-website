import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const modalRoot = typeof window !== 'undefined' ? window.document.getElementById('portal') : null;

const Portal: React.FC = ({ children }) => {
  const { current } = useRef(typeof window !== 'undefined' ? window.document.createElement('div') : null);

  useEffect(() => {
    if (current) {
      modalRoot?.appendChild(current);
    }
    return () => {
      if (current) {
        modalRoot?.removeChild(current);
      }
    };
  }, [current]);

  return current ? createPortal(children, current) : null;
};

export default Portal;
