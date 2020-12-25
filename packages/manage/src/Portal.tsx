import { FC, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

let modalRoot = window.document.getElementById('portal');
if (!modalRoot) {
  modalRoot = window.document.createElement('div');
  modalRoot.setAttribute('id', 'portal');
  window.document.body.appendChild(modalRoot);
}

const Portal: FC = ({ children }) => {
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
