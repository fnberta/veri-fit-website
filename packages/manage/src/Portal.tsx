import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const modalRoot = window.document.getElementById('portal');

const Portal: React.FC = ({ children }) => {
  const { current } = useRef(window.document.createElement('div'));

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
