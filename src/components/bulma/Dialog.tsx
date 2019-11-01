import React from 'react';
import Portal from '../Portal';

export interface Props {
  title: string;
  body: React.ReactNode;
  footer: React.ReactNode;
  onCloseClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Dialog: React.FC<Props> = ({ title, body, footer, onCloseClick }) => (
  <Portal>
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" aria-label="close" onClick={onCloseClick} />
        </header>
        <section className="modal-card-body">{body}</section>
        <footer className="modal-card-foot">{footer}</footer>
      </div>
    </div>
  </Portal>
);

export default Dialog;
