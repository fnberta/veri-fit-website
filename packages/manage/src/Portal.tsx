import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const modalRoot = window.document.getElementById('portal');

const Portal: React.FC = ({ children }) => {
  const { current } = useRef(window.document.createElement('div'));

  useEffect(() => {
    modalRoot?.appendChild(current);
    return () => {
      modalRoot?.removeChild(current);
    };
  }, [current]);

  return createPortal(children, current);
};

export default Portal;
